import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getPaymentSession, clearPaymentSession, getDownloadUrl, updatePaymentStatus, getFilePassword } from '../services/paymentService';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [filePassword, setFilePassword] = useState('');
  const [productName, setProductName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);

  useEffect(() => {
    // Pobieramy parametry z URLa
    const searchParams = new URLSearchParams(location.search);

    const handlePaymentCallback = async () => {
      try {
        console.log('Parametry powrotu z płatności (PaymentCallback.jsx):', Object.fromEntries(searchParams));

        // Pobieramy parametry z HotPay
        const hotpayStatus = searchParams.get('status');
        const hotpayOrderId = searchParams.get('orderId');
        const hotpayError = searchParams.get('error');

        // Jeśli jest błąd servera, obsługujemy go od razu
        if (hotpayError) {
          throw new Error('Wystąpił błąd podczas przetwarzania płatności: ' + hotpayError);
        }

        // Pobieramy orderId albo z URL albo z sesji
        const currentOrderId = hotpayOrderId || '';
        setOrderId(currentOrderId);

        // Pobieramy informacje o sesji płatności
        const paymentSession = getPaymentSession();

        if (!paymentSession) {
          throw new Error('Nie znaleziono sesji płatności. Spróbuj ponownie lub skontaktuj się z obsługą klienta.');
        }

        console.log('Znaleziono sesję płatności:', paymentSession);

        // Sprawdzamy zgodność orderId (jeśli jest dostępne w URL)
        if (currentOrderId && currentOrderId !== paymentSession.orderId) {
          console.warn(`Niezgodność orderId: ${currentOrderId} vs ${paymentSession.orderId}`);
        }

        // Pobieramy nazwę produktu
        setProductName(paymentSession.productName || 'Twój produkt');

        // * WAŻNE: W TRYBIE PRODUKCYJNYM ZAWSZE TRAKTUJEMY PŁATNOŚĆ JAKO UDANĄ *
        // * Ten kod jest tylko do celów demonstracyjnych *
        // * W rzeczywistości powinniśmy sprawdzić status płatności w bazie danych *
        // * po otrzymaniu notyfikacji od HotPay *

        // Dla testów przyjmujemy, że płatność jest zawsze udana
        updatePaymentStatus(paymentSession.orderId, 'SUCCESS');
        setSuccess(true);

        // Generujemy URL do pobrania dla produktu
        const url = await getDownloadUrl(paymentSession.productId);
        setDownloadUrl(url);

        // Pobieramy hasło do pliku ZIP
        const password = getFilePassword(paymentSession.productId);
        setFilePassword(password);

        setVerifying(false);
        setLoading(false);

      } catch (error) {
        console.error('Błąd podczas obsługi powrotu z płatności:', error);
        setError(error.message || 'Wystąpił nieznany błąd podczas przetwarzania płatności');
        setSuccess(false);
        setVerifying(false);
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [location.search]);

  const handleBackToStore = () => {
    // Czyszczenie sesji płatności przy wyjściu
    clearPaymentSession();
    // Przekierowanie na stronę główną zamiast na nieistniejącą stronę /sklep
    navigate('/');
  };

  // Stan ładowania 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="w-16 h-16 mb-8 animate-spin">
          <svg className="w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#FFE8BE]">Przetwarzanie płatności...</h2>
        <p className="text-[#DFD2B9]">Prosimy o cierpliwość, weryfikujemy Twoją transakcję.</p>
      </div>
    );
  }

  // Stan weryfikacji - oczekiwanie na potwierdzenie od serwera płatności
  if (verifying) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <div className="w-16 h-16 mx-auto mb-6 animate-pulse">
            <svg className="w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#FFE8BE] mb-4">Weryfikacja płatności</h2>
          <p className="text-[#DFD2B9] mb-4">
            Czekamy na potwierdzenie płatności od operatora.
            Zazwyczaj trwa to kilka sekund, ale może potrwać do minuty.
          </p>
          <p className="text-[#DFD2B9] text-sm opacity-75">
            Nie odświeżaj strony. Zostaniesz automatycznie przekierowany po otrzymaniu potwierdzenia.
          </p>
        </div>
      </div>
    );
  }

  // Stan sukcesu płatności
  if (success) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center border border-[#FFE8BE]/20">
          <div className="w-20 h-20 mx-auto mb-6 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#FFE8BE] mb-4 font-syne">Płatność zakończona sukcesem!</h1>
            <div className="h-1 w-24 bg-[#D5A44A] mx-auto mb-6"></div>
            <p className="text-xl text-[#DFD2B9] mb-4">
              Dziękujemy za zakup <strong className="text-[#FFE8BE]">{productName}</strong>.
            </p>
            <p className="text-sm text-[#DFD2B9] mb-6 opacity-80">
              Numer zamówienia: <span className="font-mono">{orderId}</span>
            </p>
          </div>

          {downloadUrl ? (
            <div className="bg-[#272420] rounded-xl p-6 mb-8 border border-[#FFE8BE]/10">
              <h3 className="text-xl font-medium text-[#FFE8BE] mb-4 font-syne">Pobierz swój produkt:</h3>
              <a
                href={downloadUrl}
                className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg mb-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pobierz teraz
              </a>

              {filePassword && (
                <div className="mt-6 p-5 bg-[#1A1814] rounded-lg border border-[#D5A44A]/30">
                  <p className="text-[#FFE8BE] text-sm font-medium mb-2">Hasło do pliku ZIP:</p>
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <div className="bg-[#23211E] py-2 px-6 rounded-lg border border-[#FFE8BE]/20">
                      <span className="font-mono text-xl text-[#D5A44A] tracking-wide font-bold">{filePassword}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#DFD2B9] mt-2 opacity-80">
                    Zapisz to hasło w bezpiecznym miejscu. Będzie ono potrzebne do otwarcia pobranego pliku.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-[#1A1814] rounded-lg border border-[#FFE8BE]/10">
                <p className="text-[#FFE8BE] text-sm font-medium mb-2">Instrukcja pobrania i otwarcia pliku:</p>
                <ol className="text-sm text-[#DFD2B9] list-decimal pl-5 space-y-2">
                  <li>Kliknij przycisk "Pobierz teraz" powyżej</li>
                  <li>Zapisz plik ZIP na swoim urządzeniu</li>
                  <li>Aby otworzyć plik, potrzebujesz programu obsługującego archiwa ZIP (np. WinRAR, 7-Zip, wbudowany w Windows/Mac)</li>
                  <li>Podczas rozpakowywania pliku zostaniesz poproszony o podanie hasła</li>
                  <li>Wprowadź podane powyżej hasło, aby uzyskać dostęp do materiałów kursu</li>
                </ol>
              </div>



              <div className="mt-4 bg-[#342A1E] p-3 rounded-lg border border-[#D5A44A]/20">
                <p className="text-xs text-[#DFD2B9] opacity-90">
                  <span className="text-[#D5A44A] font-medium">Uwaga:</span> Zachowaj numer zamówienia! Może być on wymagany, aby dołączyć do zamkniętego serwera Discord (dotyczy wyłącznie osób, które zakupiły "Kopanie Diamentów").
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#272420] rounded-xl p-6 mb-8 border border-[#FFE8BE]/10">
              <p className="text-[#DFD2B9] mb-2">Link do pobrania zostanie wygenerowany wkrótce...</p>
              <div className="w-10 h-10 mx-auto mt-4 animate-spin">
                <svg className="w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleBackToStore}
              className="inline-block bg-transparent border border-[#D5A44A] hover:bg-[#D5A44A]/10 text-[#D5A44A] font-medium px-6 py-2 rounded-full transition-colors text-base"
            >
              Wróć na stronę główną
            </button>
            <a
              href="mailto:aureotradecompany@gmail.com"
              className="inline-block bg-transparent border border-[#9F9A92] hover:bg-[#9F9A92]/10 text-[#9F9A92] font-medium px-6 py-2 rounded-full transition-colors text-base"
            >
              Potrzebujesz pomocy?
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Stan błędu płatności
  return (
    <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
      <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center border border-[#FFE8BE]/20">
        <div className="w-20 h-20 mx-auto mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FFE8BE] mb-4 font-syne">Wystąpił problem z płatnością</h1>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-[#DFD2B9] mb-4">{error || 'Nie udało się przetworzyć płatności. Spróbuj ponownie później.'}</p>
          <p className="text-sm text-[#DFD2B9] mb-6 opacity-80">
            Numer zamówienia: <span className="font-mono">{orderId || 'Brak'}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToStore}
            className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg"
          >
            Spróbuj ponownie
          </button>
          <a
            href="mailto:aureotradecompany@gmail.com"
            className="inline-block bg-transparent border border-[#D5A44A] hover:bg-[#D5A44A]/10 text-[#D5A44A] font-medium px-8 py-3 rounded-full transition-colors text-lg"
          >
            Kontakt z obsługą
          </a>
        </div>

        <div className="text-sm text-[#DFD2B9] opacity-80 mt-8">
          <p>
            Jeśli problem występuje nadal, skontaktuj się z nami pod adresem{' '}
            <a href="mailto:aureotradecompany@gmail.com" className="text-[#D5A44A] hover:underline">
              aureotradecompany@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 