import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getPaymentSession, clearPaymentSession, getDownloadUrl, updatePaymentStatus } from '../services/paymentService';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Pobieramy parametry z URLa
    const searchParams = new URLSearchParams(location.search);

    const handlePaymentCallback = async () => {
      try {
        console.log('Parametry powrotu z płatności (PaymentCallback.jsx):', Object.fromEntries(searchParams));

        // Pobieramy parametry z HotPay
        const hotpayStatus = searchParams.get('status');
        const hotpayOrderId = searchParams.get('orderId');
        const testStatus = searchParams.get('testStatus');
        const hotpayError = searchParams.get('error');

        // Jeśli mamy testStatus, używamy go zamiast statusu z HotPay
        const status = testStatus || hotpayStatus;

        // Pobieramy orderId albo z URL albo z sesji
        const currentOrderId = hotpayOrderId || '';
        setOrderId(currentOrderId);

        // Pobieramy informacje o sesji płatności
        const paymentSession = getPaymentSession();

        if (!paymentSession) {
          throw new Error('Nie znaleziono sesji płatności');
        }

        console.log('Znaleziono sesję płatności:', paymentSession);

        // Sprawdzamy zgodność orderId (jeśli jest dostępne w URL)
        if (currentOrderId && currentOrderId !== paymentSession.orderId) {
          console.warn(`Niezgodność orderId: ${currentOrderId} vs ${paymentSession.orderId}`);
        }

        // Pobieramy nazwę produktu
        setProductName(paymentSession.productName || 'Twój produkt');

        // Określamy status płatności
        // W trybie testowym, przyjmujemy testStatus jako priorytet
        let finalStatus;

        if (testStatus) {
          finalStatus = testStatus;
          console.log(`Używam testStatus: ${testStatus}`);
        } else if (status) {
          finalStatus = status;
          console.log(`Używam statusu z parametrów: ${status}`);
        } else if (paymentSession.status) {
          finalStatus = paymentSession.status;
          console.log(`Używam statusu z sesji: ${paymentSession.status}`);
        } else {
          console.log('Brak statusu płatności');
          throw new Error('Brak statusu płatności');
        }

        // Aktualizujemy status płatności
        updatePaymentStatus(paymentSession.orderId, finalStatus);

        // Decydujemy o wyniku na podstawie statusu
        if (finalStatus === 'SUCCESS') {
          setSuccess(true);

          // Generujemy URL do pobrania dla produktu
          const url = await getDownloadUrl(paymentSession.productId);
          setDownloadUrl(url);
        } else {
          const errorMessage = hotpayError || 'Wystąpił problem z płatnością. Spróbuj ponownie lub skontaktuj się z nami.';
          throw new Error(errorMessage);
        }

      } catch (error) {
        console.error('Błąd podczas obsługi powrotu z płatności:', error);
        setError(error.message || 'Wystąpił nieznany błąd podczas przetwarzania płatności');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [location.search]);

  const handleBackToStore = () => {
    // Czyszczenie sesji płatności przy wyjściu
    clearPaymentSession();
    navigate('/sklep');
  };

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

  if (success) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <div className="w-20 h-20 mx-auto mb-6 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#FFE8BE] mb-4">Płatność zakończona sukcesem!</h1>
          <p className="text-[#DFD2B9] mb-2">Dziękujemy za zakup <strong>{productName}</strong>.</p>
          <p className="text-[#DFD2B9] mb-6">Numer zamówienia: <strong>{orderId}</strong></p>

          {downloadUrl ? (
            <div className="mb-8">
              <h3 className="text-xl font-medium text-[#FFE8BE] mb-4">Pobierz swój produkt:</h3>
              <a
                href={downloadUrl}
                className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg mb-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pobierz teraz
              </a>
              <p className="text-sm text-[#DFD2B9] opacity-80">
                Link będzie aktywny przez 24 godziny. Zapisz go lub pobierz materiały od razu.
              </p>
            </div>
          ) : (
            <p className="text-[#DFD2B9] mb-6">Link do pobrania zostanie wygenerowany wkrótce...</p>
          )}

          <button
            onClick={handleBackToStore}
            className="inline-block bg-transparent border border-[#D5A44A] hover:bg-[#D5A44A]/10 text-[#D5A44A] font-medium px-6 py-2 rounded-full transition-colors text-base"
          >
            Powrót do sklepu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
      <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
        <div className="w-20 h-20 mx-auto mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#FFE8BE] mb-4">Wystąpił problem z płatnością</h1>
        <p className="text-[#DFD2B9] mb-4">{error || 'Nie udało się przetworzyć płatności. Spróbuj ponownie później.'}</p>
        <p className="text-[#DFD2B9] mb-6">Numer zamówienia: <strong>{orderId || 'Brak'}</strong></p>
        <button
          onClick={handleBackToStore}
          className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg mb-6"
        >
          Spróbuj ponownie
        </button>
        <div className="text-sm text-[#DFD2B9] opacity-80">
          <p>
            Jeśli problem występuje nadal, skontaktuj się z nami pod adresem{' '}
            <a href="mailto:kontakt@kopalniaprogramisty.pl" className="text-[#D5A44A] hover:underline">
              kontakt@kopalniaprogramisty.pl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 