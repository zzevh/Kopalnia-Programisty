import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import paymentService from '../services/paymentService';
import DownloadPage from './DownloadPage';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import { config } from '../config/env';

// Komponent do obsługi powrotu z bramki płatności
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
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
        const secure = searchParams.get('SECURE');
        const error = searchParams.get('error');
        const testStatus = searchParams.get('testStatus');

        console.log('Parametry powrotu z płatności (PaymentCallback.jsx):', {
          status, orderId, hash, secure, error, testStatus
        });

        // Obsługa błędu z endpointu callback
        if (error) {
          setError('Wystąpił błąd serwera podczas przetwarzania płatności. Prosimy o kontakt z obsługą klienta.');
          setLoading(false);
          return;
        }

        // Jeśli mamy testStatus=FAILURE, obsługujemy to jako błąd płatności
        if (testStatus === 'FAILURE') {
          setError('Płatność została odrzucona. Prosimy spróbować ponownie lub wybrać inną metodę płatności.');
          setLoading(false);
          return;
        }

        // W trybie testowym HotPay, przyjmujemy, że każdy powrót jest sukcesem, 
        // jeśli mamy ID zamówienia
        let effectiveOrderId = orderId;
        let assumeSuccess = false;

        // Jeśli nie mamy parametrów, spróbujmy odzyskać dane sesji
        if (!effectiveOrderId) {
          console.log('Brak ID zamówienia w URL, próbuję odzyskać z sessionStorage');
          // Próbujemy najpierw pobrać ostatnie ID zamówienia
          effectiveOrderId = sessionStorage.getItem('lastOrderId');

          if (effectiveOrderId) {
            console.log('Odzyskano ostatnie ID zamówienia:', effectiveOrderId);

            // Nie zakładamy automatycznie sukcesu - sprawdzamy testStatus
            if (testStatus === 'SUCCESS') {
              assumeSuccess = true;
              console.log('Status z URL: SUCCESS');
            } else if (testStatus === 'FAILURE') {
              setError('Płatność została odrzucona. Prosimy spróbować ponownie lub wybrać inną metodę płatności.');
              setLoading(false);
              return;
            } else if (status === 'SUCCESS') {
              assumeSuccess = true;
              console.log('Status z HotPay: SUCCESS');
            } else if (status === 'FAILURE') {
              setError('Płatność została odrzucona. Prosimy spróbować ponownie lub wybrać inną metodę płatności.');
              setLoading(false);
              return;
            } else {
              // Bez określonego statusu, sprawdzamy czy transakcja już istnieje
              const existingTransaction = paymentService.getTransaction(effectiveOrderId);
              if (existingTransaction && existingTransaction.status === 'SUCCESS') {
                assumeSuccess = true;
                console.log('Znaleziono istniejącą transakcję z sukcesem');
              } else {
                console.log('Brak statusu płatności, czekam na notyfikację od HotPay');
                setError('Twoja płatność jest przetwarzana. Jeśli została zakończona pomyślnie, za chwilę pojawi się link do pobrania. Jeśli tak się nie stanie, prosimy o kontakt z obsługą klienta.');
                setLoading(false);
                return;
              }
            }
          } else {
            // Spróbujmy odnaleźć ostatnią sesję płatności
            const latestSession = findLatestPaymentSession();
            if (latestSession) {
              effectiveOrderId = latestSession.orderId;
              console.log('Odzyskano ID zamówienia z ostatniej sesji:', effectiveOrderId);

              // Sprawdzamy status z URL lub HotPay
              if (testStatus === 'SUCCESS') {
                assumeSuccess = true;
              } else if (testStatus === 'FAILURE') {
                setError('Płatność została odrzucona. Prosimy spróbować ponownie lub wybrać inną metodę płatności.');
                setLoading(false);
                return;
              } else if (status === 'SUCCESS') {
                assumeSuccess = true;
              } else if (status === 'FAILURE') {
                setError('Płatność została odrzucona. Prosimy spróbować ponownie lub wybrać inną metodę płatności.');
                setLoading(false);
                return;
              } else {
                // Bez określonego statusu, wyświetlamy komunikat oczekiwania
                setError('Twoja płatność jest przetwarzana. Jeśli została zakończona pomyślnie, za chwilę pojawi się link do pobrania. Jeśli tak się nie stanie, prosimy o kontakt z obsługą klienta.');
                setLoading(false);
                return;
              }
            }
          }

          if (!effectiveOrderId) {
            setError('Nie znaleziono danych płatności. Prosimy o kontakt z obsługą klienta lub spróbuj ponownie.');
            setLoading(false);
            return;
          }
        }

        // Sprawdzamy, czy mamy już informacje o transakcji
        const transaction = paymentService.getTransaction(effectiveOrderId);

        // Jeśli transakcja została już zweryfikowana
        if (transaction && transaction.status === 'SUCCESS') {
          // Sprawdzenie ważności transakcji (dla Kopalni Złota)
          const isValid = paymentService.isTransactionValid(effectiveOrderId);

          if (!isValid && transaction.product.includes('Złota')) {
            setError('Link do produktu wygasł. Skontaktuj się z obsługą klienta.');
            setLoading(false);
            return;
          }

          setPaymentVerified(true);
          setOrderData({
            orderId: effectiveOrderId,
            product: transaction.product,
            // Pobieramy lub generujemy link do pobrania
            downloadLink: await getOrGenerateDownloadLink(effectiveOrderId, transaction.product)
          });
          setLoading(false);
          return;
        }

        // Teraz sprawdzamy efektywny status z uwzględnieniem testStatus
        let effectiveStatus;

        if (testStatus) {
          // Jeśli mamy testStatus, to jest priorytetem
          effectiveStatus = testStatus;
          console.log('Używam testStatus:', testStatus);
        } else if (status) {
          // Jeśli nie mamy testStatus, ale mamy status z HotPay
          effectiveStatus = status;
          console.log('Używam status z HotPay:', status);
        } else if (assumeSuccess) {
          // Jeśli nie mamy żadnego statusu, ale mamy założenie sukcesu
          effectiveStatus = 'SUCCESS';
          console.log('Zakładam SUCCESS na podstawie wcześniejszych warunków');
        } else {
          // Brak jakiegokolwiek statusu
          effectiveStatus = null;
          console.log('Brak statusu płatności');
        }

        // Obsługa różnych statusów płatności
        if (effectiveStatus === 'SUCCESS') {
          await handleSuccessfulPayment(effectiveOrderId);
        } else if (effectiveStatus === 'FAILURE') {
          setError('Płatność zakończyła się niepowodzeniem. Spróbuj ponownie lub wybierz inną metodę płatności.');
          setLoading(false);
        } else if (effectiveStatus === 'PENDING') {
          setError('Twoja płatność jest w trakcie przetwarzania. Otrzymasz powiadomienie e-mail o statusie płatności.');
          setLoading(false);
        } else {
          // W przypadku nieoczekiwanego statusu albo jego braku
          setError(`Błąd podczas przetwarzania płatności. Prosimy o kontakt z obsługą klienta.`);
          setLoading(false);
        }
      } catch (err) {
        console.error('Błąd podczas weryfikacji płatności:', err);
        setError('Wystąpił błąd podczas weryfikacji płatności. Prosimy o kontakt z obsługą klienta.');
        setLoading(false);
      }
    }

    // Funkcja do znajdowania ostatniej sesji płatności
    function findLatestPaymentSession() {
      try {
        // Sprawdzamy w sessionStorage wszystkie klucze zaczynające się od "payment_"
        let latestTimestamp = 0;
        let latestSession = null;

        // Przeglądamy wszystkie klucze w sessionStorage
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key.startsWith('payment_')) {
            try {
              const orderId = key.replace('payment_', '');
              const encryptedData = sessionStorage.getItem(key);

              // Próbujemy odszyfrować dane
              const decryptedBytes = CryptoJS.AES.decrypt(
                encryptedData,
                config.hotpay.notificationPassword
              );

              const dataStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
              const data = JSON.parse(dataStr);

              // Sprawdzamy czy to najnowsza sesja
              if (data.timestamp > latestTimestamp) {
                latestTimestamp = data.timestamp;
                latestSession = {
                  orderId,
                  product: data.product,
                  email: data.email,
                  price: data.price,
                  timestamp: data.timestamp
                };
              }
            } catch (e) {
              console.error('Błąd podczas odszyfrowywania sesji:', e);
              // Ignorujemy błędne wpisy
            }
          }
        }

        return latestSession;
      } catch (err) {
        console.error('Błąd podczas szukania ostatniej sesji:', err);
        return null;
      }
    }

    // Funkcja pomocnicza do obsługi odzyskanej sesji
    async function handleSuccessfulRecovery(orderId, product) {
      try {
        // Generuj link do pobrania
        const downloadLink = await paymentService.generateDownloadLink(product);

        setPaymentVerified(true);
        setOrderData({
          orderId,
          product,
          downloadLink
        });
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas odzyskiwania sesji:', error);
        setError('Wystąpił błąd podczas odzyskiwania informacji o płatności.');
        setLoading(false);
      }
    }

    // Funkcja pomocnicza do obsługi udanej płatności
    async function handleSuccessfulPayment(orderId) {
      try {
        // Pobierz zaszyfrowane dane o produkcie
        const orderData = paymentService.getOrderData(orderId);

        if (orderData) {
          const { product, email } = orderData;

          console.log('Obsługa sukcesu płatności dla produktu:', product);

          // Zapisz transakcję jako SUCCESS
          const transaction = await paymentService.saveTransaction({
            orderId,
            product,
            status: 'SUCCESS',
            email
          });

          // Generuj link do pobrania
          const downloadLink = await paymentService.generateDownloadLink(product);
          console.log('Wygenerowano link do pobrania:', downloadLink.substring(0, 50) + '...');

          // Zapisz zaszyfrowany link do pobrania
          const encryptedLink = CryptoJS.AES.encrypt(
            downloadLink,
            config.hotpay.notificationPassword
          ).toString();

          localStorage.setItem(`download_link_${orderId}`, encryptedLink);

          setPaymentVerified(true);
          setOrderData({
            orderId,
            product,
            downloadLink
          });
        } else {
          setError('Nie znaleziono informacji o zamówieniu. Prosimy o kontakt z obsługą klienta.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas przetwarzania udanej płatności:', error);
        setError('Wystąpił błąd podczas przetwarzania płatności. Prosimy o kontakt z obsługą klienta.');
        setLoading(false);
      }
    }

    // Funkcja pomocnicza do pobierania lub generowania linku
    async function getOrGenerateDownloadLink(orderId, product) {
      // Pobierz istniejący link jeśli istnieje
      const encryptedLink = localStorage.getItem(`download_link_${orderId}`);

      if (encryptedLink) {
        try {
          // Odszyfruj link
          const decryptedBytes = CryptoJS.AES.decrypt(
            encryptedLink,
            config.hotpay.notificationPassword
          );

          return decryptedBytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error('Błąd podczas odszyfrowywania linku:', error);
        }
      }

      // Jeśli nie ma linku lub wystąpił błąd, wygeneruj nowy
      return await paymentService.generateDownloadLink(product);
    }

    // Wykonaj weryfikację przy każdej zmianie parametrów URL
    verifyPayment();
  }, [searchParams, navigate]);

  // Komponent ładowania
  if (loading) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <motion.div
          className="w-16 h-16 mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.div>
        <p className="text-[#FFE8BE] text-xl">Weryfikacja płatności...</p>
      </div>
    );
  }

  // Komponent błędu
  if (error) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-20 h-20 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-4">Wystąpił problem</h2>
          <p className="text-[#DFD2B9] mb-8">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/', { replace: true })}
            className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg"
          >
            Wróć na stronę główną
          </motion.button>
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