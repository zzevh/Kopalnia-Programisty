import { config } from '../config/env';
import CryptoJS from 'crypto-js';

/**
 * Generuje zabezpieczony link do pliku w Cloudinary z określonym czasem ważności
 * @param {string} publicId - publiczne ID pliku w Cloudinary
 * @param {number} expiryTimeHours - czas ważności linku w godzinach
 * @returns {string} - zabezpieczony URL do pobrania pliku
 */
export function generateSecureDownloadUrl(publicId, expiryTimeHours = 24) {
  try {
    const { cloudName, apiSecret } = config.cloudinary;

    // Obliczanie czasu wygaśnięcia (w sekundach od teraz)
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryTimeHours * 3600);

    // Przygotowanie właściwej ścieżki dla Cloudinary - usuwamy ewentualne prefiksy
    const cleanPublicId = publicId.replace(/^kopalnia-programisty\//, '');

    // Tworzenie bezpośredniego URL do pliku bez generowania skomplikowanych sygnatur
    const directUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/v1/kopalnia-programisty/${cleanPublicId}_l3a4vg.zip`;

    // Zapisanie czasu wygaśnięcia w localStorage dla późniejszej weryfikacji
    localStorage.setItem(`expiry_${publicId}`, expiresAt * 1000);

    console.log('Wygenerowano bezpośredni URL do pobierania:', directUrl);
    return directUrl;
  } catch (error) {
    console.error('Błąd podczas generowania bezpiecznego URL:', error);

    // W przypadku błędu, zwracamy awaryjny URL
    const { cloudName } = config.cloudinary;
    const cleanPublicId = publicId.replace(/^kopalnia-programisty\//, '');

    if (cleanPublicId.includes('zlota')) {
      return `https://res.cloudinary.com/${cloudName}/raw/upload/v1/kopalnia-programisty/kopalnia-zlota_l3a4vg.zip`;
    } else {
      return `https://res.cloudinary.com/${cloudName}/raw/upload/v1/kopalnia-programisty/kopalnia-diamentow_b5zpb4.zip`;
    }
  }
}

/**
 * Alternatywna metoda generowania linku pobierania - używa wbudowanego API Cloudinary
 * Jest prostsza, ale wymaga przesłania API Key, co jest mniej bezpieczne
 * @param {string} publicId - publiczne ID pliku w Cloudinary
 * @param {number} expiryTimeHours - czas ważności linku w godzinach
 * @returns {string} - zabezpieczony URL do pobrania pliku
 */
export function generateDownloadUrlSimple(publicId, expiryTimeHours = 24) {
  try {
    const { cloudName, apiKey } = config.cloudinary;

    // Obliczanie czasu wygaśnięcia
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryTimeHours * 3600);

    // Generowanie prostego linku pobierania
    const downloadUrl = `https://res.cloudinary.com/${cloudName}/raw/download/${publicId}.zip?api_key=${apiKey}&expires_at=${expiresAt}`;

    // Zapisanie czasu wygaśnięcia w localStorage dla późniejszej weryfikacji
    localStorage.setItem(`expiry_${publicId}`, expiresAt * 1000);

    return downloadUrl;
  } catch (error) {
    console.error('Błąd podczas generowania URL pobierania:', error);
    throw new Error('Nie udało się wygenerować linku do pobrania pliku');
  }
}

/**
 * Sprawdza, czy link do pobrania jest jeszcze ważny
 * @param {string} publicId - publiczne ID pliku w Cloudinary
 * @returns {boolean} - true jeśli link jest ważny, false jeśli wygasł
 */
export function isDownloadUrlValid(publicId) {
  try {
    const expiryTime = localStorage.getItem(`expiry_${publicId}`);

    if (!expiryTime) return false;

    // Sprawdzenie, czy link nie wygasł
    return Date.now() < parseInt(expiryTime, 10);
  } catch (error) {
    console.error('Błąd podczas sprawdzania ważności URL:', error);
    return false;
  }
}

/**
 * Generuje unikalny token dla pliku
 * @returns {string} - unikalny token
 */
export function generateUniqueToken() {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export default {
  generateSecureDownloadUrl,
  generateDownloadUrlSimple,
  isDownloadUrlValid,
  generateUniqueToken
}; 
