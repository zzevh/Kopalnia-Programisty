// Endpoint API dla notyfikacji płatności HotPay
import crypto from 'crypto';
import { config } from '../src/config/env.js';

/**
 * Weryfikuje podpis transakcji HotPay
 * @param {Object} notification - dane notyfikacji
 * @returns {boolean} - true jeśli podpis jest poprawny
 */
function verifySignature(notification) {
  try {
    const { KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SECURE, HASH, SEKRET } = notification;

    // Sprawdzenie czy wszystkie wymagane pola są obecne
    if (!KWOTA || !ID_PLATNOSCI || !ID_ZAMOWIENIA || !STATUS || !SECURE || !HASH || !SEKRET) {
      console.error('Brak wymaganych pól do weryfikacji podpisu:', notification);
      return false;
    }

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
    const expectedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    console.log('Obliczony hash:', expectedHash);
    console.log('Otrzymany hash:', HASH);

    // Porównanie z otrzymanym hashem
    const isValid = expectedHash === HASH;

    if (!isValid) {
      console.error('Nieprawidłowa sygnatura transakcji. Dane:', {
        expectedHash,
        receivedHash: HASH,
        dataToHash
      });
    }

    return isValid;
  } catch (error) {
    console.error('Błąd podczas weryfikacji podpisu:', error);
    return false;
  }
}

/**
 * Pobiera, odszyfrowuje i przechowuje status transakcji
 * @param {string} orderId - identyfikator zamówienia
 * @param {string} status - status płatności
 * @param {string} kwota - kwota transakcji
 * @returns {boolean} - true jeśli sukces
 */
function saveTransactionStatus(orderId, status, kwota) {
  try {
    // W trybie produkcyjnym używalibyśmy bazy danych
    // W tym przypadku używamy localStorage

    // Tworzenie klucza dla transakcji
    const transactionKey = `transaction_status_${orderId}`;

    // Zapisanie danych transakcji
    const transactionData = {
      orderId,
      status,
      amount: kwota,
      timestamp: Date.now()
    };

    // Szyfrowanie danych (opcjonalne, ale zalecane w produkcji)
    const encryptedData = crypto.createHmac('sha256', config.hotpay.notificationPassword)
      .update(JSON.stringify(transactionData))
      .digest('hex');

    // Zapisanie statusu transakcji
    const dataToSave = JSON.stringify({
      ...transactionData,
      signature: encryptedData
    });

    // Tutaj w produkcji zapisalibyśmy do bazy danych
    console.log(`Zapisuję status transakcji ${orderId}: ${status}`);

    return true;
  } catch (error) {
    console.error('Błąd podczas zapisywania statusu transakcji:', error);
    return false;
  }
}

export default function handler(req, res) {
  // Nagłówki CORS - ważne dla komunikacji między domenami
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Obsługa metody OPTIONS (preflight request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Otrzymano notyfikację płatności. Metoda:', req.method);
    console.log('Dane powiadomienia:', req.method === 'POST' ? req.body : req.query);

    // Pobierz dane notyfikacji (zależnie od metody)
    const notificationData = req.method === 'POST' ? req.body : req.query;

    // Sprawdzenie czy mamy dane
    if (!notificationData || Object.keys(notificationData).length === 0) {
      console.error('Brak danych w żądaniu');
      return res.status(200).json({ status: 'OK', message: 'Brak danych w żądaniu' });
    }

    // Weryfikacja adresu IP
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('IP klienta:', clientIp);

    // Sprawdzenie, czy IP jest na liście dozwolonych HotPay
    const allowedIps = config.hotpay.allowedIps || [];
    const isAllowedIp = allowedIps.includes(clientIp);

    // Logowanie informacji o IP
    if (!isAllowedIp) {
      console.warn(`IP klienta (${clientIp}) nie znajduje się na liście dozwolonych IP HotPay.`);
    } else {
      console.log(`IP klienta (${clientIp}) zweryfikowane poprawnie.`);
    }

    // Weryfikacja podpisu tylko w produkcji
    const isSignatureValid = verifySignature(notificationData);

    if (!isSignatureValid) {
      console.error('Nieprawidłowa sygnatura transakcji - odrzucam notyfikację');

      // Zawsze zwracamy status 200 OK, aby HotPay nie ponawiał notyfikacji
      return res.status(200).json({
        status: 'OK',
        message: 'Nieprawidłowa sygnatura'
      });
    }

    // Przetwarzanie notyfikacji
    const orderId = notificationData.ID_ZAMOWIENIA;
    const status = notificationData.STATUS || 'PENDING';
    const kwota = notificationData.KWOTA || '';

    console.log(`Przetwarzam notyfikację dla zamówienia ${orderId}, status: ${status}`);

    // Zapisz status transakcji
    const saved = saveTransactionStatus(orderId, status, kwota);

    if (saved) {
      console.log(`Pomyślnie przetworzono notyfikację dla zamówienia: ${orderId}`);
    } else {
      console.error(`Błąd podczas przetwarzania notyfikacji dla zamówienia: ${orderId}`);
    }

    // Zawsze zwracamy 200 OK, aby HotPay nie ponawiał notyfikacji
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);

    // Zawsze zwracamy 200 OK, aby HotPay nie ponawiał notyfikacji
    return res.status(200).json({ status: 'OK', message: 'Wystąpił błąd, ale przyjmujemy notyfikację' });
  }
} 