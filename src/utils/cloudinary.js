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

    // Tworzenie parametrów podpisanych URL
    const parameters = {
      public_id: publicId,
      format: 'zip', // Zakładamy, że pliki są w formacie ZIP
      expires_at: expiresAt,
      attachment: true, // Wymusza pobieranie pliku zamiast wyświetlania
      type: 'authenticated' // Użycie uwierzytelniania URL
    };

    // Sortowanie parametrów w kolejności alfabetycznej
    const sortedParameters = Object.keys(parameters)
      .sort()
      .map(key => `${key}=${parameters[key]}`)
      .join('&');

    // Generowanie podpisu
    const signature = CryptoJS.SHA1(`${sortedParameters}${apiSecret}`).toString();

    // Tworzenie pełnego adresu URL z podpisem
    const secureUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/s--${signature}--/fl_attachment/${publicId}.zip`;

    // Zapisanie czasu wygaśnięcia w localStorage dla późniejszej weryfikacji
    localStorage.setItem(`expiry_${publicId}`, expiresAt * 1000);

    return secureUrl;
  } catch (error) {
    console.error('Błąd podczas generowania bezpiecznego URL:', error);
    throw new Error('Nie udało się wygenerować linku do pobrania pliku');
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
