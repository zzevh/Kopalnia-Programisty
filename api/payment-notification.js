// Endpoint API dla notyfikacji płatności HotPay
import crypto from 'crypto';
import { config } from '../src/config/env.js';

/**
 * Weryfikuje podpis transakcji HotPay
 * @param {Object} notification - dane notyfikacji
 * @returns {boolean} - true jeśli podpis jest poprawny
 */
function verifySignature(notification) {
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
  const expectedHash = crypto.createHash('sha256').update(dataToHash).toString('hex');

  // Porównanie z otrzymanym hashem
  return expectedHash === HASH;
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

    // Weryfikacja adresu IP
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const allowedIps = config.hotpay.allowedIps;

    if (!allowedIps.includes(clientIp)) {
      console.error(`Nieautoryzowany dostęp z IP: ${clientIp}`);
      return res.status(403).json({ error: 'Nieautoryzowane IP' });
    }

    // Weryfikacja podpisu transakcji
    if (!verifySignature(notificationData)) {
      console.error('Nieprawidłowa sygnatura transakcji');
      return res.status(400).json({ error: 'Nieprawidłowa sygnatura' });
    }

    // Przetwarzanie notyfikacji
    const { ID_ZAMOWIENIA, STATUS } = notificationData;

    // W prawdziwej implementacji zapisalibyśmy tutaj dane do bazy danych
    // Na potrzeby tej implementacji wykorzystamy localStorage po stronie klienta
    // W realnym wdrożeniu produkcyjnym należy użyć bazy danych!

    if (STATUS === 'SUCCESS') {
      // Tutaj aplikacja powinna zapisać informację o udanej płatności w bazie danych
      console.log(`Płatność ${ID_ZAMOWIENIA} zaakceptowana`);
    } else if (STATUS === 'FAILURE') {
      console.log(`Płatność ${ID_ZAMOWIENIA} odrzucona`);
    } else if (STATUS === 'PENDING') {
      console.log(`Płatność ${ID_ZAMOWIENIA} oczekująca`);
    }

    // Zwróć status 200 OK, aby HotPay nie ponawiał powiadomień
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
} 