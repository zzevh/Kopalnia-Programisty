# Instrukcja konfiguracji płatności HotPay

## Kroki konfiguracji

1. **Rejestracja konta HotPay**
   - Zarejestruj konto na stronie https://hotpay.pl/rejestracja/
   - Uzupełnij wszystkie wymagane dane i aktywuj konto przelewem

2. **Rejestracja serwisu w HotPay**
   - Zaloguj się do panelu HotPay
   - Przejdź do https://hotpay.pl/przelewy_sklep_nowy/ i dodaj nowy serwis
   - Podaj nazwę: "Kopalnia Programisty"
   - Uzupełnij wszystkie wymagane dane i poczekaj na akceptację

3. **Konfiguracja serwisu po zaakceptowaniu**
   - Z panelu HotPay skopiuj SEKRET wygenerowany dla Twojego serwisu
   - Otwórz plik `src/components/PaymentModal.jsx` i zastąp `TWOJ_SEKRET_HOTPAY` prawdziwym sekretem:
   ```jsx
   SEKRET: 'TWOJ_SEKRET_HOTPAY', // ← Zastąp tym z panelu HotPay
   ```

4. **Konfiguracja adresu notyfikacji**
   - W panelu HotPay ustaw adres notyfikacji na:
   ```
   https://twoja-domena.pl/api/payment-notification
   ```
   - Skopiuj "hasło notyfikacji" wygenerowane przez HotPay

5. **Implementacja endpointu odbierającego notyfikacje**
   - W przyszłości należy zaimplementować endpoint serwerowy do odbierania notyfikacji
   - Endpoint powinien weryfikować płatności przez porównanie hashu z parametrami
   - Obecnie system działa bez serwera (przez localStorage)

## Ważne informacje

1. **Linki do pobrania**:
   - Kopalnia Złota: Link aktywny 24h (zaimplementowane przez localStorage)
   - Kopalnia Diamentów: Link aktywny na zawsze

2. **Publiczne pliki**:
   > "ma byc to ebzpeicznie dla mnmie i klienta moze nawet byc pobierz plik button i plik w public LECZ nie preferuje tego bo z tego co wiem nie jest to bezpiecnze dla mnie bo mozna wygrasc plliki z publick(napisz czy to prawda!!)"

   **Odpowiedź**: To prawda. Pliki umieszczone w folderze `public` są dostępne publicznie i każdy może je pobrać znając URL. Dla rzeczywistego systemu płatności zalecane jest:
   
   - Przechowywanie plików poza folderem public
   - Implementacja serwera backend
   - Generowanie tymczasowych/zabezpieczonych linków do pobrania
   - Weryfikacja, czy użytkownik faktycznie zapłacił za produkt

3. **Bezpieczeństwo** - obecna implementacja:
   - Jest to rozwiązanie demonstracyjne
   - W rzeczywistości powinieneś używać serwera do weryfikacji płatności
   - Obecna implementacja kliencka (localStorage) NIE jest bezpieczna produkcyjnie

## Co działa obecnie:

1. Popup z animacjami przy kliknięciu "Kup Kopalnię Złota" lub "Kup Kopalnię Diamentów"
2. Formularz z polami email i nazwisko
3. Wybór metody płatności (HotPay - aktywne, PaySafeCard - nieaktywne/w weryfikacji)
4. Przekierowanie do bramki płatności HotPay
5. Obsługa powrotu z płatności
6. Strona z linkiem do pobrania po pomyślnej płatności
7. Licznik 24h dla Kopalni Złota
8. Dostęp bezterminowy dla Kopalni Diamentów

## Zastrzeżenia:

Ta implementacja jest tylko frontendem i wymaga prawdziwego serwera do pełnej obsługi płatności. Obecna wersja służy do demonstracji i nie powinna być używana w środowisku produkcyjnym bez dodatkowych zabezpieczeń serwerowych. 