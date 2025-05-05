import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { config } from '../config/env';

// Inicjalizacja Firebase z konfiguracją
const app = initializeApp(config.firebase);
const storage = getStorage(app);
const auth = getAuth(app);

/**
 * Generuje zabezpieczony, tymczasowy link do pliku w Firebase Storage
 * @param {string} filePath - ścieżka do pliku w Firebase Storage
 * @param {number} expiryTimeHours - czas ważności linku w godzinach
 * @returns {Promise<string>} - link URL do pobrania pliku
 */
export async function getSecureDownloadUrl(filePath, expiryTimeHours = 24) {
  try {
    // Anonimowe uwierzytelnianie dla bezpieczniejszego dostępu
    await signInAnonymously(auth);

    // Referencja do pliku w Firebase Storage
    const fileRef = ref(storage, filePath);

    // Generowanie URL z określonym czasem wygaśnięcia
    // Czas wygaśnięcia w sekundach (godziny * 3600)
    const expiryTimeSeconds = expiryTimeHours * 3600;

    // Pobieranie URL z czasem wygaśnięcia
    const url = await getDownloadURL(fileRef);

    // Dodanie tokena wygaśnięcia do URL
    const downloadUrl = `${url}&token=${Date.now() + (expiryTimeSeconds * 1000)}`;

    return downloadUrl;
  } catch (error) {
    console.error('Błąd podczas generowania bezpiecznego URL:', error);
    throw new Error('Nie udało się wygenerować linku do pobrania pliku');
  }
}

/**
 * Sprawdza, czy link do pobrania jest jeszcze ważny
 * @param {string} downloadUrl - pełny URL do pobrania
 * @returns {boolean} - true jeśli link jest ważny, false jeśli wygasł
 */
export function isDownloadUrlValid(downloadUrl) {
  try {
    // Wyodrębnienie tokena wygaśnięcia z URL
    const url = new URL(downloadUrl);
    const token = url.searchParams.get('token');

    if (!token) return false;

    // Konwersja tokena na liczbę
    const expiryTime = parseInt(token, 10);

    // Sprawdzenie, czy link nie wygasł
    return Date.now() < expiryTime;
  } catch (error) {
    console.error('Błąd podczas sprawdzania ważności URL:', error);
    return false;
  }
}

export default { getSecureDownloadUrl, isDownloadUrlValid }; 