import { config } from '../config/env';
import { generateSecureDownloadUrl } from '../utils/cloudinary';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Klucz szyfrowania dla danych sesji płatności
const ENCRYPTION_KEY = config.hotpay.notificationPassword;

// Sesja płatności ma klucz oparty na ID zamówienia
const PAYMENT_SESSION_PREFIX = 'payment_';

// Stałe dla API HotPay
const HOTPAY_API_URL = 'https://platnosc.hotpay.pl/';

/**
 * Klasa serwisu obsługującego płatności - wersja produkcyjna
 */
class PaymentService {
  /**
   * Generuje unikalny identyfikator zamówienia
   * @returns {string} - unikalny ID zamówienia
   */
  generateOrderId() {
    return `KP_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * Generuje formularz płatności HotPay
   * @param {Object} paymentData - dane płatności
   * @param {string} paymentData.product - nazwa produktu
   * @param {string} paymentData.price - cena produktu
   * @param {string} paymentData.email - email klienta
   * @param {string} paymentData.personName - imię i nazwisko klienta
   * @returns {Object} - dane do formularza płatności
   */
  generatePaymentFormData(paymentData) {
    const { product, price, email, personName } = paymentData;

    // Generowanie ID zamówienia
    const orderId = this.generateOrderId();

    // Mapowanie nazwy produktu na ID
    const productIdMap = {
      'Kopalnia Złota': 'gold_mine',
      'Kopalnia Diamentów': 'diamond_mine'
    };

    // Szyfrowanie danych transakcji dla bezpieczeństwa
    const orderData = {
      orderId,
      productId: productIdMap[product] || 'unknown_product',
      productName: product,
      price,
      email,
      personName,
      timestamp: Date.now(),
      status: 'PENDING'
    };

    // Zapisywanie zaszyfrowanych danych zamówienia
    const orderDataStr = JSON.stringify(orderData);
    const encryptedData = CryptoJS.AES.encrypt(
      orderDataStr,
      ENCRYPTION_KEY
    ).toString();

    // Zapisujemy zaszyfrowane dane w localStorage
    localStorage.setItem(PAYMENT_SESSION_PREFIX + orderId, encryptedData);

    // Zapisujemy również ID ostatniego zamówienia, aby można było je odzyskać
    localStorage.setItem('lastOrderId', orderId);

    console.log('Generowanie danych formularza dla zamówienia:', orderId);
    console.log('URL powrotu:', config.hotpay.returnUrl);

    // Dodajemy ID zamówienia do URL powrotu, aby HotPay przekazał je
    const returnUrl = `${config.hotpay.returnUrl}?ID_ZAMOWIENIA=${orderId}`;

    // Dane formularza HotPay zgodnie z dokumentacją
    // https://dokumentacja.hotpay.pl/
    return {
      SEKRET: config.hotpay.secret,
      KWOTA: price,
      NAZWA_USLUGI: product,
      ID_ZAMOWIENIA: orderId,
      EMAIL: email,
      DANE_OSOBOWE: personName || 'Brak danych',
      ADRES_WWW: returnUrl, // Dodajemy ID zamówienia do adresu powrotu
      POWROT_OK: returnUrl, // URL po sukcesie
      POWROT_BLAD: returnUrl, // URL po błędzie
      POWROT: returnUrl, // Generalny URL powrotu
      TYP_PLATNOSCI: "ALL", // Wszystkie metody płatności
      OPIS_PLATNOSCI: `Zakup ${product}`,
      POBIERZ: "TRUE" // Parametr informujący o pobraniu płatności
    };
  }

  /**
   * Weryfikuje podpis transakcji HotPay
   * @param {Object} notification - dane notyfikacji
   * @returns {boolean} - true jeśli podpis jest poprawny
   */
  verifySignature(notification) {
    const { KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SECURE, HASH, SEKRET } = notification;

    // Generowanie oczekiwanego hasha
    const dataToHash = [
      config.hotpay.notificationPassword, // HASLO_Z_USTAWIEN
      KWOTA,
      ID_PLATNOSCI,
      ID_ZAMOWIENIA,
      STATUS,
      SECURE,
      SEKRET
    ].join(';');

    // Generowanie SHA-256
    const expectedHash = CryptoJS.SHA256(dataToHash).toString();

    // Porównanie z otrzymanym hashem
    return expectedHash === HASH;
  }

  /**
   * Odszyfrowuje dane zamówienia
   * @param {string} orderId - ID zamówienia
   * @returns {Object|null} - dane zamówienia lub null jeśli nie znaleziono
   */
  getOrderData(orderId) {
    try {
      const encryptedData = localStorage.getItem(PAYMENT_SESSION_PREFIX + orderId);
      if (!encryptedData) return null;

      // Odszyfrowanie danych
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedData,
        ENCRYPTION_KEY
      );

      // Konwersja do tekstu, a następnie do obiektu
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Błąd podczas odszyfrowywania danych zamówienia:', error);
      return null;
    }
  }

  /**
   * Generuje zabezpieczony link do pobrania pliku
   * @param {string} product - nazwa produktu
   * @returns {Promise<string>} - link do pobrania
   */
  async generateDownloadLink(product) {
    try {
      // Wybór odpowiedniego pliku i czasu wygaśnięcia na podstawie produktu
      let publicId;
      let expiryTimeHours;

      if (product.includes('Złota')) {
        publicId = config.downloads.urls.goldMine;
        expiryTimeHours = config.downloads.goldValidityHours;
      } else if (product.includes('Diamentów')) {
        publicId = config.downloads.urls.diamondMine;
        expiryTimeHours = config.downloads.diamondValidityDays * 24; // Dni na godziny
      } else {
        throw new Error('Nieznany produkt');
      }

      // Generowanie bezpiecznego URL
      const downloadUrl = generateSecureDownloadUrl(publicId, expiryTimeHours);

      return downloadUrl;
    } catch (error) {
      console.error('Błąd podczas generowania linku do pobrania:', error);
      throw error;
    }
  }

  /**
   * Zapisuje informację o transakcji
   * @param {Object} transactionData - dane transakcji
   * @returns {Promise<Object>} - zapisana transakcja
   */
  async saveTransaction(transactionData) {
    try {
      const { orderId, product, status, timestamp, email } = transactionData;

      // Generowanie unikalnego ID transakcji
      const transactionId = `trans_${Date.now()}_${uuidv4().substring(0, 8)}`;

      // Szyfrowanie danych transakcji dla dodatkowego bezpieczeństwa
      const transaction = {
        transactionId,
        orderId,
        product,
        status,
        timestamp: timestamp || Date.now(),
        email,
        // Dla Kopalni Złota ustawiamy czas wygaśnięcia
        expiryTime: product.includes('Złota')
          ? Date.now() + (config.downloads.goldValidityHours * 60 * 60 * 1000)
          : null
      };

      // Szyfrowanie danych transakcji przed zapisaniem
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(transaction),
        ENCRYPTION_KEY
      ).toString();

      // Zapisywanie w localStorage (w produkcji używalibyśmy bazy danych)
      localStorage.setItem(`transaction_${orderId}`, encryptedData);

      // Tworzenie indeksu dla łatwiejszego wyszukiwania transakcji po emailu
      if (email) {
        const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${email}`) || '[]');
        if (!userTransactions.includes(orderId)) {
          userTransactions.push(orderId);
          localStorage.setItem(`user_transactions_${email}`, JSON.stringify(userTransactions));
        }
      }

      return transaction;
    } catch (error) {
      console.error('Błąd podczas zapisywania transakcji:', error);
      throw error;
    }
  }

  /**
   * Pobiera informacje o transakcji
   * @param {string} orderId - ID zamówienia
   * @returns {Object|null} - dane transakcji lub null jeśli nie znaleziono
   */
  getTransaction(orderId) {
    try {
      const encryptedData = localStorage.getItem(`transaction_${orderId}`);
      if (!encryptedData) return null;

      // Odszyfrowanie danych
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedData,
        ENCRYPTION_KEY
      );

      // Konwersja do tekstu, a następnie do obiektu
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji:', error);
      return null;
    }
  }

  /**
   * Sprawdza, czy transakcja jest jeszcze ważna (dla Kopalni Złota)
   * @param {string} orderId - ID zamówienia
   * @returns {boolean} - true jeśli transakcja jest ważna
   */
  isTransactionValid(orderId) {
    try {
      const transaction = this.getTransaction(orderId);

      if (!transaction) return false;

      // Dla Kopalni Diamentów zawsze zwracamy true
      if (!transaction.product.includes('Złota')) return true;

      // Dla Kopalni Złota sprawdzamy czas wygaśnięcia
      return transaction.expiryTime && Date.now() < transaction.expiryTime;
    } catch (error) {
      console.error('Błąd podczas sprawdzania ważności transakcji:', error);
      return false;
    }
  }

  /**
   * Sprawdza status płatności w HotPay
   * UWAGA: Ta funkcja powinna być używana tylko po stronie serwera
   * W praktyce, implementujemy ją po stronie serwera w API
   * @param {string} orderId - ID zamówienia
   * @returns {Promise<string>} - status płatności
   */
  async checkPaymentStatus(orderId) {
    try {
      // W produkcji, to zapytanie powinno być wykonane po stronie serwera
      // Tutaj symulujemy odpowiedź
      console.log(`Sprawdzanie statusu płatności dla ${orderId} - SYMULACJA`);

      // W rzeczywistej implementacji, sprawdzamy status w bazie danych
      // który został zaktualizowany przez notyfikację HotPay

      // Dla celów testowych, zwracamy status z zapisanej transakcji
      const transaction = this.getTransaction(orderId);
      if (transaction) {
        return transaction.status;
      }

      // Jeśli nie ma transakcji, sprawdzamy dane zamówienia
      const orderData = this.getOrderData(orderId);
      if (orderData) {
        return orderData.status || 'PENDING';
      }

      return 'UNKNOWN';
    } catch (error) {
      console.error('Błąd podczas sprawdzania statusu płatności:', error);
      return 'ERROR';
    }
  }
}

const paymentService = new PaymentService();

/**
 * Pobiera sesję płatności
 * @returns {Object|null} - dane sesji płatności lub null
 */
export function getPaymentSession() {
  try {
    // Pobieramy ostatnie ID zamówienia
    const lastOrderId = localStorage.getItem('lastOrderId');

    if (!lastOrderId) {
      console.log('Brak zapisanego ID zamówienia');
      return findLatestPaymentSession();
    }

    // Pobieramy zaszyfrowane dane
    const encryptedData = localStorage.getItem(PAYMENT_SESSION_PREFIX + lastOrderId);

    if (!encryptedData) {
      console.log('Brak danych sesji dla ID:', lastOrderId);
      return findLatestPaymentSession();
    }

    // Deszyfrujemy dane
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const sessionData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    console.log('Pobrano sesję płatności:', lastOrderId);
    return sessionData;
  } catch (error) {
    console.error('Błąd podczas pobierania sesji płatności:', error);
    return null;
  }
}

/**
 * Znajduje najnowszą sesję płatności
 * @returns {Object|null} - dane sesji płatności lub null
 */
function findLatestPaymentSession() {
  try {
    let latestTimestamp = 0;
    let latestSession = null;

    // Przeszukujemy wszystkie klucze w localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith(PAYMENT_SESSION_PREFIX)) {
        try {
          const encryptedData = localStorage.getItem(key);
          const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
          const sessionData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          if (sessionData.timestamp > latestTimestamp) {
            latestTimestamp = sessionData.timestamp;
            latestSession = sessionData;
          }
        } catch (e) {
          // Ignorujemy błędne wpisy
        }
      }
    }

    if (latestSession) {
      console.log('Znaleziono najnowszą sesję płatności:', latestSession.orderId);
    } else {
      console.log('Nie znaleziono żadnej sesji płatności');
    }

    return latestSession;
  } catch (error) {
    console.error('Błąd podczas wyszukiwania sesji płatności:', error);
    return null;
  }
}

/**
 * Czyści sesję płatności
 */
export function clearPaymentSession() {
  try {
    const lastOrderId = localStorage.getItem('lastOrderId');

    if (lastOrderId) {
      localStorage.removeItem(PAYMENT_SESSION_PREFIX + lastOrderId);
      localStorage.removeItem('lastOrderId');
    }

    console.log('Wyczyszczono sesję płatności');
    return true;
  } catch (error) {
    console.error('Błąd podczas czyszczenia sesji płatności:', error);
    return false;
  }
}

/**
 * Aktualizuje status płatności
 * @param {string} orderId - ID zamówienia
 * @param {string} status - nowy status
 * @returns {boolean} - true jeśli aktualizacja się powiodła
 */
export function updatePaymentStatus(orderId, status) {
  try {
    if (!orderId) {
      console.error('Brak ID zamówienia');
      return false;
    }

    const key = PAYMENT_SESSION_PREFIX + orderId;
    const encryptedData = localStorage.getItem(key);

    if (!encryptedData) {
      console.error('Nie znaleziono sesji płatności dla ID:', orderId);
      return false;
    }

    // Deszyfrowanie
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const sessionData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Aktualizacja statusu
    sessionData.status = status;
    sessionData.lastUpdated = Date.now();

    // Ponowne szyfrowanie i zapis
    const updatedEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sessionData),
      ENCRYPTION_KEY
    ).toString();

    localStorage.setItem(key, updatedEncryptedData);

    // Dodatkowo zapisujemy informację o transakcji
    paymentService.saveTransaction({
      orderId,
      product: sessionData.productName,
      status,
      email: sessionData.email
    });

    console.log(`Zaktualizowano status płatności dla ${orderId} na ${status}`);
    return true;
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu płatności:', error);
    return false;
  }
}

/**
 * Generuje URL do pobrania pliku
 * @param {string} productId - ID produktu
 * @returns {Promise<string>} - URL do pobrania
 */
export async function getDownloadUrl(productId) {
  try {
    if (!productId) {
      throw new Error('Brak ID produktu');
    }

    // Produkty i ich odpowiedniki w Cloudinary
    const productMap = {
      'gold_mine': {
        publicId: config.downloads.urls.goldMine,
        expiryHours: config.downloads.goldValidityHours
      },
      'diamond_mine': {
        publicId: config.downloads.urls.diamondMine,
        expiryHours: config.downloads.diamondValidityDays * 24
      }
    };

    const product = productMap[productId];

    if (!product) {
      throw new Error(`Nieznany produkt: ${productId}`);
    }

    // Generowanie bezpiecznego URL przez cloudinary
    const downloadUrl = generateSecureDownloadUrl(product.publicId, product.expiryHours);

    console.log(`Wygenerowano URL do pobrania dla produktu ${productId}`);
    return downloadUrl;
  } catch (error) {
    console.error('Błąd podczas generowania URL do pobrania:', error);
    throw error;
  }
}

export default paymentService; 