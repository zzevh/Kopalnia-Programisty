import { config } from '../config/env';
import CryptoJS from 'crypto-js';

/**
 * Generuje link do pliku ZIP na MediaFire
 * @param {string} publicId - identyfikator pliku (używany do określenia typu kursu)
 * @param {number} expiryTimeHours - czas ważności linku w godzinach (nieistotne dla zewnętrznych plików)
 * @returns {string} - URL do pobrania pliku
 */
export function generateSecureDownloadUrl(publicId, expiryTimeHours = 24) {
  try {
    // Linki do plików na MediaFire
    const MEDIAFIRE_FILES = {
      "kopalnia-zlota": "https://www.mediafire.com/file/q83i7qejqzncixi/Kopalnia-zlota.zip/file",
      "kopalnia-diamentow": "https://www.mediafire.com/file/b06gazn9laemnih/Kopalnia-diamentow.zip/file",
    };

    // Określenie typu kursu
    const type = publicId.includes('zlota') ? 'kopalnia-zlota' : 'kopalnia-diamentow';

    // Zapisanie czasu wygaśnięcia w localStorage dla późniejszej weryfikacji
    // (zachowujemy to dla kompatybilności z istniejącym kodem)
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryTimeHours * 3600);
    localStorage.setItem(`expiry_${publicId}`, expiresAt * 1000);

    // Zwrócenie linku do pliku na MediaFire
    console.log(`Generowanie linku do pliku na MediaFire: ${type}`);
    return MEDIAFIRE_FILES[type];
  } catch (error) {
    console.error('Błąd podczas generowania linku do pobrania:', error);

    // Awaryjne linki
    return publicId.includes('zlota')
      ? "https://www.mediafire.com/file/q83i7qejqzncixi/Kopalnia-zlota.zip/file"
      : "https://www.mediafire.com/file/b06gazn9laemnih/Kopalnia-diamentow.zip/file";
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
  // Różne hasła dla różnych produktów
  if (productId === 'diamond_mine' || productId.includes('diament')) {
    return "KP_AmDbX";
  }
  // Dla Kopalni Złota i wszystkich innych produktów
  return "KP_Tn4s";
}

export default {
  generateSecureDownloadUrl,
  generateDownloadUrlSimple,
  isDownloadUrlValid,
  generateUniqueToken,
  getZipPassword
}; 
