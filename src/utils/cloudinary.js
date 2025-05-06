import { config } from '../config/env';
import CryptoJS from 'crypto-js';

/**
 * Generuje link do lokalnego pliku ZIP zabezpieczonego hasłem
 * @param {string} publicId - identyfikator pliku (używany do określenia typu kursu)
 * @param {number} expiryTimeHours - czas ważności linku w godzinach (nieistotne dla lokalnych plików)
 * @returns {string} - URL do pobrania pliku
 */
export function generateSecureDownloadUrl(publicId, expiryTimeHours = 24) {
  try {
    // Lokalne ścieżki do plików ZIP zabezpieczonych hasłem
    const LOCAL_FILES = {
      "kopalnia-zlota": "/downloads/kopalnia-zlota.zip",
      "kopalnia-diamentow": "/downloads/kopalnia-diamentow.zip",
    };

    // Określenie typu kursu
    const type = publicId.includes('zlota') ? 'kopalnia-zlota' : 'kopalnia-diamentow';

    // Zapisanie czasu wygaśnięcia w localStorage dla późniejszej weryfikacji
    // (zachowujemy to dla kompatybilności z istniejącym kodem)
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryTimeHours * 3600);
    localStorage.setItem(`expiry_${publicId}`, expiresAt * 1000);

    // Zwrócenie ścieżki do lokalnego pliku
    console.log(`Generowanie linku do lokalnego pliku: ${type}`);
    return LOCAL_FILES[type];
  } catch (error) {
    console.error('Błąd podczas generowania linku do pobrania:', error);

    // Awaryjne linki
    return publicId.includes('zlota')
      ? "/downloads/kopalnia-zlota.zip"
      : "/downloads/kopalnia-diamentow.zip";
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

/**
 * Zwraca hasło do pliku ZIP dla danego produktu
 * @param {string} productId - ID produktu (gold_mine lub diamond_mine)
 * @returns {string} - Hasło do pliku ZIP
 */
export function getZipPassword(productId) {
  // Stałe hasło do wszystkich plików ZIP zgodnie z wymaganiami
  return "KP_Tn4s";
}

export default {
  generateSecureDownloadUrl,
  generateDownloadUrlSimple,
  isDownloadUrlValid,
  generateUniqueToken,
  getZipPassword
}; 
