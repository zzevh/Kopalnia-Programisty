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
      console.error('Brak wymaganych pól do weryfikacji podpisu');
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
    const expectedHash = crypto.createHash('sha256').update(dataToHash).toString('hex');

    // Porównanie z otrzymanym hashem
    return expectedHash === HASH;
  } catch (error) {
    console.error('Błąd podczas weryfikacji podpisu:', error);
    return false;
  }
}

/**
 * Utwórz wpis w bazie dla płatności (imitacja dla localStorage)
 */
function createPaymentRecord(id, status) {
  try {
    // W rzeczywistej implementacji tutaj zapisalibyśmy dane w bazie
    // Na potrzeby testów używamy localStorage/sessionStorage w komponencie
    console.log(`Zapisano transakcję ${id} ze statusem ${status}`);
    return true;
  } catch (error) {
    console.error('Błąd podczas zapisywania transakcji:', error);
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

  // Sprawdź czy to GET (testowy) czy POST (prawdziwy)
  const isTestMode = req.method === 'GET';

  if (req.method !== 'POST' && !isTestMode) {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  try {
    // W trybie GET (testowym) tworzymy sztuczne dane notyfikacji
    let notificationData = req.body;

    // Dla trybu testowego, pozyskujemy dane z query string
    if (isTestMode) {
      notificationData = req.query;
      console.log('Tryb testowy - pobrano dane z parametrów URL');
    }

    console.log('Otrzymano notyfikację płatności:', notificationData);

    // Sprawdzenie czy mamy dane
    if (!notificationData || Object.keys(notificationData).length === 0) {
      console.error('Brak danych w żądaniu');
      return res.status(200).json({ status: 'ERROR', message: 'Brak danych w żądaniu' });
    }

    // Weryfikacja adresu IP - tymczasowo wyłączona do testów produkcyjnych
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('IP klienta:', clientIp);

    /* Komentujemy weryfikację IP do celów testowych
    const allowedIps = config.hotpay.allowedIps;
    
    if (!allowedIps.includes(clientIp)) {
      console.error(`Nieautoryzowany dostęp z IP: ${clientIp}`);
      return res.status(403).json({ error: 'Nieautoryzowane IP' });
    }
    */

    // Weryfikacja podpisu transakcji - pomijamy w trybie testowym
    if (!isTestMode && !verifySignature(notificationData)) {
      console.error('Nieprawidłowa sygnatura transakcji');
      // Zwracamy 200 OK zamiast błędu, aby HotPay nie ponawiał notyfikacji
      return res.status(200).json({ status: 'ERROR', message: 'Nieprawidłowa sygnatura' });
    }

    // Przetwarzanie notyfikacji
    const orderId = notificationData.ID_ZAMOWIENIA;
    const status = notificationData.STATUS || 'SUCCESS'; // W trybie testowym, domyślnie SUCCESS

    // Zapisujemy transakcję - w rzeczywistej implementacji byłaby baza danych
    const success = createPaymentRecord(orderId, status);

    // Wyświetlamy log
    console.log(`Otrzymano status płatności: ${status} dla zamówienia: ${orderId} (zapis: ${success ? 'udany' : 'nieudany'})`);

    // Zwróć status 200 OK, aby HotPay nie ponawiał powiadomień
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);
    // Zwracamy 200 OK nawet w przypadku błędu, aby HotPay nie ponawiał notyfikacji
    return res.status(200).json({ status: 'ERROR', message: error.message });
  }
} 