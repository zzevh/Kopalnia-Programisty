import { config } from '../config/env';
import { generateSecureDownloadUrl } from '../utils/cloudinary';
import CryptoJS from 'crypto-js';

/**
 * Klasa serwisu obsługującego płatności
 */
class PaymentService {
  /**
   * Generuje unikalny identyfikator zamówienia
   * @returns {string} - unikalny ID zamówienia
   */
  generateOrderId() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `order_${timestamp}_${randomPart}`;
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

    // Zapisywanie informacji o produkcie (w rzeczywistości powinno być w bazie danych)
    // To jest tylko tymczasowe rozwiązanie, docelowo w API
    sessionStorage.setItem(`payment_${orderId}`, JSON.stringify({
      product,
      price,
      email,
      personName,
      timestamp: Date.now()
    }));

    // Dane formularza zgodnie z dokumentacją HotPay
    return {
      SEKRET: config.hotpay.secret,
      KWOTA: price,
      NAZWA_USLUGI: product,
      ID_ZAMOWIENIA: orderId,
      EMAIL: email,
      DANE_OSOBOWE: personName,
      ADRES_WWW: config.hotpay.returnUrl
    };
  }

  /**
   * Weryfikuje podpis transakcji HotPay
   * @param {Object} notification - dane notyfikacji
   * @returns {boolean} - true jeśli podpis jest poprawny
   */
  verifySignature(notification) {
    const { KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SECURE, HASH, SEKRET } = notification;

    // Weryfikacja IP (tylko dla API)
    // if (!config.hotpay.allowedIps.includes(requestIp)) return false;

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

      // Generowanie bezpiecznego URL z Cloudinary
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
   * @returns {Promise<void>}
   */
  async saveTransaction(transactionData) {
    // W rzeczywistej implementacji zapisujemy dane transakcji w bazie
    // Tu używamy localStorage tylko dla demonstracji

    try {
      const { orderId, product, status, timestamp, email } = transactionData;

      // Generowanie unikalnego ID transakcji
      const transactionId = `trans_${Date.now()}`;

      // Obiekt transakcji do zapisania
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

      // Zapisywanie w localStorage (w produkcji używalibyśmy bazy danych)
      localStorage.setItem(`transaction_${orderId}`, JSON.stringify(transaction));

      // Tworzenie indeksu dla łatwiejszego wyszukiwania transakcji po emailu
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${email}`) || '[]');
      userTransactions.push(orderId);
      localStorage.setItem(`user_transactions_${email}`, JSON.stringify(userTransactions));

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
      const transactionData = localStorage.getItem(`transaction_${orderId}`);
      return transactionData ? JSON.parse(transactionData) : null;
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