import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import paymentService from '../services/paymentService';
import DownloadPage from './DownloadPage';

// Komponent do obsługi powrotu z bramki płatności
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Pobieranie parametrów z URL
        const status = searchParams.get('STATUS');
        const orderId = searchParams.get('ID_ZAMOWIENIA');
        const hash = searchParams.get('HASH');

        console.log('Parametry powrotu:', { status, orderId, hash, path: location.pathname });

        // Tryb testowy HotPay: w trybie testowym, gdy użytkownik kliknie "Powrót do sklepu",
        // próbujemy znaleźć ostatnią transakcję w sessionStorage
        if (!status && !orderId) {
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

            console.log('Znaleziono ostatnią sesję:', { latestOrderId, sessionData });

            // Zasymuluj pomyślną płatność (tylko w trybie testowym / dev)
            if (window.location.hostname === 'localhost' ||
              window.location.hostname.includes('kopalnia-programisty')) {

              // Zapisz transakcję jako udaną
              await paymentService.saveTransaction({
                orderId: latestOrderId,
                product: sessionData.product,
                status: 'SUCCESS',
                email: sessionData.email
              });

              // Generuj link do pobrania
              const downloadLink = await paymentService.generateDownloadLink(sessionData.product);
              localStorage.setItem(`download_link_${latestOrderId}`, downloadLink);

              setPaymentVerified(true);
              setOrderData({
                orderId: latestOrderId,
                product: sessionData.product,
                downloadLink
              });
              setLoading(false);
              return;
            }
          }

          setError('Brak informacji o płatności. Spróbuj ponownie lub skontaktuj się z obsługą.');
          setLoading(false);
          return;
        }

        // Standardowe przetwarzanie, gdy mamy parametry z URL
        if (status && orderId) {
          // Sprawdzamy, czy mamy już informacje o transakcji
          const transaction = paymentService.getTransaction(orderId);

          // Jeśli transakcja już istnieje i jest zweryfikowana
          if (transaction && transaction.status === 'SUCCESS') {
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
              // Pobieramy link z localStorage (w rzeczywistej implementacji byłaby z API)
              downloadLink: localStorage.getItem(`download_link_${orderId}`)
            });
            setLoading(false);
            return;
          }

          // Przetwarzanie nowej transakcji
          if (status === 'SUCCESS') {
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
              // Brak danych o produkcie - błąd
              setError('Nie znaleziono informacji o zamówieniu');
            }
          } else if (status === 'FAILURE') {
            // Płatność nieudana
            setError('Płatność zakończyła się niepowodzeniem');
          } else {
            // Inny status
            setError(`Nieznany status płatności: ${status}`);
          }
        } else {
          setError('Brak wymaganych parametrów płatności');
        }

        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas weryfikacji płatności:', err);
        setError('Wystąpił błąd podczas weryfikacji płatności: ' + err.message);
        setLoading(false);
      }
    }

    // Wykonaj weryfikację przy każdej zmianie parametrów URL
    verifyPayment();
  }, [searchParams, navigate, location]);

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
    if (!loading && !paymentVerified && !error) {
      navigate('/', { replace: true });
    }
  }, [loading, paymentVerified, error, navigate]);

  return null;
};

export default PaymentCallback; 