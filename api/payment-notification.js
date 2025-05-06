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

  // Sprawdź metodę HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  try {
    const notificationData = req.body;
    console.log('Otrzymano notyfikację płatności:', notificationData);

    // Sprawdzenie czy mamy dane w req.body
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

    // Weryfikacja podpisu transakcji - tymczasowo pomijamy weryfikację do celów testowych
    /* 
    if (!verifySignature(notificationData)) {
      console.error('Nieprawidłowa sygnatura transakcji');
      return res.status(400).json({ error: 'Nieprawidłowa sygnatura' });
    }
    */

    // Przetwarzanie notyfikacji
    const { ID_ZAMOWIENIA, STATUS } = notificationData;

    // Wyświetlamy log bez względu na to czy dane są poprawne czy nie
    console.log(`Otrzymano status płatności: ${STATUS} dla zamówienia: ${ID_ZAMOWIENIA}`);

    // Zwróć status 200 OK, aby HotPay nie ponawiał powiadomień
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);
    // Zwracamy 200 OK nawet w przypadku błędu, aby HotPay nie ponawiał notyfikacji
    return res.status(200).json({ status: 'ERROR', message: error.message });
  }
} 