# Produkcyjna integracja HotPay - Dokumentacja

## Opis implementacji

Ta dokumentacja opisuje produkcyjną implementację systemu płatności HotPay dla "Kopalni Programisty". Wdrożenie obejmuje bezpieczne zarządzanie płatnościami, weryfikację płatności po stronie serwera oraz bezpieczne udostępnianie plików z różnymi okresami ważności:

- **Kopalnia Złota**: plik dostępny przez 24 godziny
- **Kopalnia Diamentów**: dostęp bezterminowy

## Architektura systemu

### 1. Frontend (React)
- Bezpieczne zarządzanie kluczami API przez zmienne środowiskowe
- Szyfrowanie danych wrażliwych
- Bezpieczne generowanie linków do pobierania plików
- Walidacja danych wejściowych

### 2. Przechowywanie plików (Firebase Storage)
- Pliki przechowywane poza publicznym folderem
- Linki z ograniczonym czasem dostępu (wygasające)
- Uwierzytelnianie dostępu do plików

### 3. Weryfikacja płatności
- Weryfikacja podpisów cyfrowych
- Sprawdzanie dozwolonych adresów IP
- Bezpieczne przetwarzanie notyfikacji płatności

## Pełny cykl płatności

1. **Inicjalizacja płatności**:
   - Klient wybiera produkt i potwierdza zakup w formularzu
   - System generuje unikalny identyfikator zamówienia
   - Klient przekierowywany jest do bramki płatności HotPay
   
2. **Weryfikacja płatności**:
   - HotPay wysyła notyfikację na wskazany adres URL (webhook)
   - System weryfikuje podpis cyfrowy i źródłowy adres IP
   - Sprawdzana jest poprawność danych transakcji
   
3. **Generowanie dostępu**:
   - Po pozytywnej weryfikacji system generuje tymczasowy link do pobrania
   - Dla Kopalni Złota link jest ważny 24 godziny
   - Dla Kopalni Diamentów link jest ważny bezterminowo
   
4. **Pobieranie pliku**:
   - Klient pobiera plik z zabezpieczonego serwera
   - System weryfikuje ważność linku przed udostępnieniem pliku

## Wymagania techniczne

### Zależności
- Node.js v16+
- Firebase (dla bezpiecznego przechowywania plików)
- React v19+
- Crypto-JS (dla bezpiecznej weryfikacji podpisów)

### Konfiguracja Firebase
1. Utwórz projekt Firebase: https://console.firebase.google.com/
2. Włącz Firebase Storage
3. Skonfiguruj reguły bezpieczeństwa:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /downloads/{allFiles=**} {
      allow read: if request.auth != null && request.auth.token.validated == true;
      allow write: if false;
    }
  }
}
```

## Konfiguracja produkcyjna

### 1. Zmienne środowiskowe
Skopiuj plik `src/config/env.example.js` do `src/config/env.js` i uzupełnij wszystkie pola:

```javascript
export const config = {
  hotpay: {
    secret: "twoj_sekret_hotpay",
    notificationPassword: "twoje_haslo_notyfikacji",
    notificationUrl: "https://api.twoja-domena.pl/api/payment/notification",
    // ...
  },
  firebase: {
    apiKey: "twoj_api_key",
    // ...
  },
  // ...
}
```

### 2. Konfiguracja HotPay
1. Zarejestruj konto na https://hotpay.pl/rejestracja/
2. Utwórz nowy serwis przez panel HotPay
3. Skonfiguruj adres notyfikacji płatności
4. Skopiuj sekret i hasło notyfikacji do konfiguracji

### 3. Przygotowanie plików
1. Wgraj pliki kursów do Firebase Storage:
   - `/downloads/kopalnia-zlota.zip`
   - `/downloads/kopalnia-diamentow.zip`
2. Ustaw odpowiednie uprawnienia dostępu

### 4. Instalacja i uruchomienie
```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie developerskim
npm run dev

# Budowanie wersji produkcyjnej
npm run build
```

## Bezpieczeństwo

System implementuje następujące mechanizmy bezpieczeństwa:

1. **Weryfikacja płatności**:
   - Weryfikacja podpisów SHA-256
   - Sprawdzanie dozwolonych adresów IP HotPay
   - Walidacja danych transakcji

2. **Bezpieczne przechowywanie plików**:
   - Pliki poza publicznym dostępem
   - Tymczasowe linki z określonym czasem ważności
   - Uwierzytelnianie dostępu do plików

3. **Ochrona danych transakcji**:
   - Szyfrowanie ID transakcji
   - Bezpieczne przechowywanie danych wrażliwych
   - Weryfikacja integralności danych

## Porównanie z poprzednią implementacją

### Poprzednia wersja:
- Pliki w folderze `public` (brak zabezpieczeń)
- Dane przechowywane w `localStorage` (brak szyfrowania)
- Brak rzeczywistej weryfikacji płatności
- Statyczne linki do plików

### Obecna wersja produkcyjna:
- Pliki bezpiecznie przechowywane w Firebase Storage
- Bezpieczne generowanie tymczasowych linków
- Weryfikacja płatności po stronie serwera
- Szyfrowanie danych transakcji
- Walidacja wszystkich danych wejściowych

## Realizacja celów biznesowych

1. **Kopalnia Złota (dostęp 24h)**:
   - Link wygasający po 24 godzinach
   - Licznik czasu pozostałego do wygaśnięcia
   - Zabezpieczenie przed nieautoryzowanym dostępem

2. **Kopalnia Diamentów (dostęp bezterminowy)**:
   - Bezpieczny link z długim okresem ważności
   - Uwierzytelnianie dostępu
   - Możliwość ponownego generowania linku

## Wtyki i rozszerzenia

### 1. Integracja z systemem e-mail
Można dodać automatyczne wysyłanie e-maili z linkami do pobrania przez:
- Podłączenie systemu wysyłki e-mail (np. SendGrid, Mailgun)
- Implementację szablonów e-mail
- Automatyzację wysyłki po potwierdzeniu płatności

### 2. Panel administracyjny
Można dodać panel administracyjny do:
- Zarządzania płatnościami
- Podglądu statystyk sprzedaży
- Zarządzania dostępami klientów

## Problemy i rozwiązania

### Potencjalne problemy:
1. **Niepowodzenie weryfikacji płatności**:
   - Implementacja ponownych prób
   - Logowanie błędów
   - Informowanie administratora o problemach

2. **Nieudane pobieranie plików**:
   - Alternatywne sposoby dostarczania plików
   - Obsługa błędów Firebase
   - System raportowania błędów

## Kontakt i wsparcie

W razie problemów z implementacją lub pytań technicznych:
- Discord: [link do serwera Discord]
- Email: [adres email do wsparcia technicznego]

---

**Dokument przygotowany dla Kopalni Programisty** 