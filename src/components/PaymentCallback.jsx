import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/PaymentCallback.module.css';
import {
  getPaymentSession,
  clearPaymentSession,
  getDownloadUrl,
  updatePaymentStatus
} from '../services/paymentService';

export default function PaymentCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Sprawdzamy czy parametry URL są dostępne
    if (!router.isReady) return;

    const handlePaymentCallback = async () => {
      try {
        console.log('Parametry powrotu z płatności (PaymentCallback.jsx):', router.query);

        // Pobieramy parametry z HotPay
        const {
          status: hotpayStatus,
          orderId: hotpayOrderId,
          testStatus,
          error: hotpayError
        } = router.query;

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
  }, [router.isReady, router.query]);

  const handleBackToStore = () => {
    // Czyszczenie sesji płatności przy wyjściu
    clearPaymentSession();
    router.push('/sklep');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingAnimation}>
          <Image src="/img/loading.gif" alt="Ładowanie" width={100} height={100} />
        </div>
        <h2>Przetwarzanie płatności...</h2>
        <p>Prosimy o cierpliwość, weryfikujemy Twoją transakcję.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <Image src="/img/success.png" alt="Sukces" width={100} height={100} />
        </div>
        <h1>Płatność zakończona sukcesem!</h1>
        <p>Dziękujemy za zakup <strong>{productName}</strong>.</p>
        <p>Numer zamówienia: <strong>{orderId}</strong></p>

        {downloadUrl ? (
          <div className={styles.downloadSection}>
            <h3>Pobierz swój produkt:</h3>
            <a
              href={downloadUrl}
              className={styles.downloadButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pobierz teraz
            </a>
            <p className={styles.note}>
              Link będzie aktywny przez 24 godziny. Zapisz go lub pobierz materiały od razu.
            </p>
          </div>
        ) : (
          <p>Link do pobrania zostanie wygenerowany wkrótce...</p>
        )}

        <button
          onClick={handleBackToStore}
          className={styles.backButton}
        >
          Powrót do sklepu
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.errorIcon}>
        <Image src="/img/error.png" alt="Błąd" width={100} height={100} />
      </div>
      <h1>Wystąpił problem z płatnością</h1>
      <p>{error || 'Nie udało się przetworzyć płatności. Spróbuj ponownie później.'}</p>
      <p>Numer zamówienia: <strong>{orderId}</strong></p>
      <button
        onClick={handleBackToStore}
        className={styles.backButton}
      >
        Spróbuj ponownie
      </button>
      <div className={styles.supportInfo}>
        <p>
          Jeśli problem występuje nadal, skontaktuj się z nami pod adresem{' '}
          <a href="mailto:kontakt@kopalniaprogramisty.pl">kontakt@kopalniaprogramisty.pl</a>
        </p>
      </div>
    </div>
  );
} 