import { config } from '../config/env';
import { generateSecureDownloadUrl } from '../utils/cloudinary';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Klasa serwisu obsługującego płatności - wersja produkcyjna
 */
class PaymentService {
  /**
   * Generuje unikalny identyfikator zamówienia
   * @returns {string} - unikalny ID zamówienia
   */
  generateOrderId() {
    return `KP_${Date.now()}_${uuidv4().substring(0, 8)}`;
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

    // Szyfrowanie danych transakcji dla bezpieczeństwa
    const orderData = {
      product,
      price,
      email,
      personName,
      timestamp: Date.now()
    };

    // Zapisywanie zaszyfrowanych danych zamówienia
    const orderDataStr = JSON.stringify(orderData);
    const encryptedData = CryptoJS.AES.encrypt(
      orderDataStr,
      config.hotpay.notificationPassword
    ).toString();

    // Zapisujemy zaszyfrowane dane w sessionStorage
    sessionStorage.setItem(`payment_${orderId}`, encryptedData);

    // Dane formularza HotPay zgodnie z dokumentacją
    // https://dokumentacja.hotpay.pl/
    return {
      SEKRET: config.hotpay.secret,
      KWOTA: price,
      NAZWA_USLUGI: product,
      ID_ZAMOWIENIA: orderId,
      EMAIL: email,
      DANE_OSOBOWE: personName || 'Brak danych',
      ADRES_WWW: `${config.app.url}/payment/callback`,
      TYP_PLATNOSCI: "ALL", // Wszystkie metody płatności
      OPIS_PLATNOSCI: `Zakup ${product}`,
      POWROT_OK: `${config.app.url}/payment/callback`, // URL powrotu po sukcesie
      POWROT_BLAD: `${config.app.url}/payment/callback`, // URL powrotu po błędzie
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
      const encryptedData = sessionStorage.getItem(`payment_${orderId}`);
      if (!encryptedData) return null;

      // Odszyfrowanie danych
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedData,
        config.hotpay.notificationPassword
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
        config.hotpay.notificationPassword
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
        config.hotpay.notificationPassword
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
}

export default new PaymentService(); 