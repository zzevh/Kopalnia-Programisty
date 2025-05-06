import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import paymentService from '../services/paymentService';
import DownloadPage from './DownloadPage';
import { config } from '../config/env';

// Komponent do obsługi powrotu z bramki płatności
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Stan dla trybu testowego - widoczność wyboru statusu
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [testOrderId, setTestOrderId] = useState(null);
  const [testSessionData, setTestSessionData] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Pobieranie parametrów z URL
        const status = searchParams.get('STATUS');
        const orderId = searchParams.get('ID_ZAMOWIENIA');
        const hash = searchParams.get('HASH');

        console.log('Parametry powrotu:', { status, orderId, hash, isProduction: config.hotpay.isProduction });

        // Jeśli mamy parametry z URL (tryb produkcyjny lub przekierowanie testowe)
        if (status && orderId) {
          console.log('Przetwarzanie płatności z parametrami:', { status, orderId });

          // Sprawdzamy, czy mamy już informacje o transakcji
          const transaction = paymentService.getTransaction(orderId);

          // Jeśli transakcja już istnieje i jest zweryfikowana
          if (transaction && transaction.status === 'SUCCESS') {
            console.log('Transakcja już istnieje:', transaction);

            // Sprawdzenie ważności transakcji (dla Kopalni Złota)
            const isValid = paymentService.isTransactionValid(orderId);

            if (!isValid && transaction.product.includes('Złota')) {
              setError('Link do produktu wygasł');
              setLoading(false);
              return;
            }

            setPaymentVerified(true);
            setOrderData({
              orderId,
              product: transaction.product,
              downloadLink: localStorage.getItem(`download_link_${orderId}`)
            });
            setLoading(false);
            return;
          }

          // Przetwarzanie nowej transakcji w zależności od statusu
          if (status === 'SUCCESS') {
            console.log('Przetwarzanie płatności z sukcesem:', orderId);

            // Pobierz dane o produkcie z sessionStorage
            const paymentInfo = sessionStorage.getItem(`payment_${orderId}`);

            if (paymentInfo) {
              const { product, email } = JSON.parse(paymentInfo);

              // Zapisz transakcję
              await paymentService.saveTransaction({
                orderId,
                product,
                status: 'SUCCESS',
                email
              });

              // Generuj link do pobrania
              const downloadLink = await paymentService.generateDownloadLink(product);
              localStorage.setItem(`download_link_${orderId}`, downloadLink);

              setPaymentVerified(true);
              setOrderData({
                orderId,
                product,
                downloadLink
              });
            } else {
              setError('Nie znaleziono informacji o zamówieniu. Prosimy o kontakt z obsługą.');
            }
          } else if (status === 'FAILURE') {
            setError('Płatność zakończyła się niepowodzeniem. Prosimy spróbować ponownie.');
          } else {
            setError(`Nieznany status płatności: ${status}. Prosimy o kontakt z obsługą.`);
          }

          setLoading(false);
          return;
        }

        // Tryb testowy HotPay - obsługa powrotu bez parametrów
        // Ten kod działa TYLKO w trybie testowym - w produkcji zawsze będą parametry
        if (!status && !orderId && !config.hotpay.isProduction) {
          console.log('Tryb testowy - brak parametrów, pokazujemy symulację');

          // Sprawdź ostatnią sesję płatności
          const sessionKeys = Object.keys(sessionStorage).filter(key => key.startsWith('payment_'));

          if (sessionKeys.length > 0) {
            // Sortuj według czasu (najnowszy na górze)
            sessionKeys.sort((a, b) => {
              const timeA = JSON.parse(sessionStorage.getItem(a)).timestamp || 0;
              const timeB = JSON.parse(sessionStorage.getItem(b)).timestamp || 0;
              return timeB - timeA;
            });

            // Pobierz najnowszą sesję
            const latestKey = sessionKeys[0];
            const latestOrderId = latestKey.replace('payment_', '');
            const sessionData = JSON.parse(sessionStorage.getItem(latestKey));

            console.log('Znaleziono ostatnią sesję dla trybu testowego:', { latestOrderId, sessionData });

            // Pokaż opcje testowe tylko w trybie deweloperskim/testowym
            setTestOrderId(latestOrderId);
            setTestSessionData(sessionData);
            setShowTestOptions(true);
            setLoading(false);
            return;
          }

          setError('Brak informacji o płatności. Prosimy o kontakt z obsługą.');
          setLoading(false);
          return;
        }

        // Jeśli dotarliśmy tutaj, oznacza to, że nie mamy parametrów
        // i nie jesteśmy w trybie testowym - przekieruj na stronę główną
        if (config.hotpay.isProduction) {
          navigate('/', { replace: true });
          return;
        }

        setError('Nieznany stan płatności. Prosimy o kontakt z obsługą.');
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas weryfikacji płatności:', err);
        setError('Wystąpił błąd podczas weryfikacji płatności. Prosimy o kontakt z obsługą.');
        setLoading(false);
      }
    }

    // Wykonaj weryfikację przy każdej zmianie parametrów URL
    verifyPayment();
  }, [searchParams, navigate, location]);

  // Funkcje obsługi trybu testowego
  const handleTestSuccess = async () => {
    try {
      if (!testOrderId || !testSessionData) return;

      console.log('Symulacja sukcesu płatności dla:', testOrderId);

      // Zapisz transakcję jako udaną
      await paymentService.saveTransaction({
        orderId: testOrderId,
        product: testSessionData.product,
        status: 'SUCCESS',
        email: testSessionData.email
      });

      // Generuj link do pobrania
      const downloadLink = await paymentService.generateDownloadLink(testSessionData.product);
      localStorage.setItem(`download_link_${testOrderId}`, downloadLink);

      // Ustaw stan pomyślnej płatności
      setPaymentVerified(true);
      setOrderData({
        orderId: testOrderId,
        product: testSessionData.product,
        downloadLink
      });

      // Ukryj opcje testowe
      setShowTestOptions(false);
    } catch (err) {
      console.error('Błąd podczas symulacji sukcesu:', err);
      setError('Wystąpił błąd podczas symulacji płatności: ' + err.message);
    }
  };

  const handleTestFailure = () => {
    setError('Płatność zakończyła się niepowodzeniem (tryb testowy)');
    setShowTestOptions(false);
  };

  // Komponent wyboru statusu w trybie testowym
  if (showTestOptions) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-6">Tryb testowy HotPay</h2>
          <p className="text-[#DFD2B9] mb-8">
            Wybierz status płatności do symulacji. W prawdziwym środowisku HotPay sam przekazałby status.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleTestSuccess}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
            >
              Symuluj Sukces
            </button>

            <button
              onClick={handleTestFailure}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
            >
              Symuluj Błąd
            </button>
          </div>

          <div className="text-[#9F9A92] text-sm mt-4">
            ID zamówienia: {testOrderId} | Produkt: {testSessionData?.product}
          </div>
        </div>
      </div>
    );
  }

  // Komponent ładowania
  if (loading) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="w-16 h-16 mb-8">
          <svg className="animate-spin w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-[#FFE8BE] text-xl">Weryfikacja płatności...</p>
      </div>
    );
  }

  // Komponent błędu
  if (error) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <svg className="w-20 h-20 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-4">Wystąpił problem</h2>
          <p className="text-[#DFD2B9] mb-8">
            {error}
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg"
          >
            Wróć na stronę główną
          </button>
        </div>
      </div>
    );
  }

  // Komponent sukcesu
  if (paymentVerified && orderData) {
    return (
      <DownloadPage
        product={orderData.product}
        orderId={orderData.orderId}
        downloadLink={orderData.downloadLink}
      />
    );
  }

  // Nieoczekiwany stan - przekieruj na stronę główną
  useEffect(() => {
    if (!loading && !paymentVerified && !error && !showTestOptions) {
      navigate('/', { replace: true });
    }
  }, [loading, paymentVerified, error, showTestOptions, navigate]);

  return null;
};

export default PaymentCallback; 