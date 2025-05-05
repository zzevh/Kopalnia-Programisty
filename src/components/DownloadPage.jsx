import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import paymentService from '../services/paymentService';
import { config } from '../config/env';

const DownloadPage = ({ product, orderId, downloadLink }) => {
  const [countdown, setCountdown] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secureLink, setSecureLink] = useState(downloadLink || null);

  // Sprawdzenie statusu płatności i ważności linku
  useEffect(() => {
    async function verifyAndLoad() {
      try {
        // Sprawdzenie, czy transakcja istnieje i jest ważna
        const isValid = paymentService.isTransactionValid(orderId);

        if (!isValid && product.includes('Złota')) {
          setIsExpired(true);
        } else if (!secureLink) {
          // Jeśli nie mamy jeszcze linku do pobrania, generujemy go
          try {
            const link = await paymentService.generateDownloadLink(product);
            setSecureLink(link);

            // Zapisujemy link do localStorage (w rzeczywistej implementacji byłoby to w bazie)
            localStorage.setItem(`download_link_${orderId}`, link);
          } catch (err) {
            console.error('Błąd podczas generowania linku:', err);
            setError('Nie udało się wygenerować linku do pobrania. Spróbuj ponownie później.');
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas ładowania strony pobrania:', err);
        setError('Wystąpił błąd podczas ładowania strony pobrania');
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [product, orderId, secureLink]);

  // Ustawienie licznika czasu dla kopalni złota (24h)
  useEffect(() => {
    if (!loading && product.includes('Złota') && !isExpired) {
      const transaction = paymentService.getTransaction(orderId);

      if (!transaction || !transaction.expiryTime) return;

      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = transaction.expiryTime - now;

        if (timeLeft <= 0) {
          setIsExpired(true);
          setCountdown(null);
          return;
        }

        // Formatowanie licznika
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      };

      // Aktualizacja co sekundę
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, product, orderId, isExpired]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-16 h-16 mb-8">
          <svg className="animate-spin w-full h-full text-[#D5A44A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-[#FFE8BE] text-xl">Przygotowywanie dostępu do kursu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <svg className="w-20 h-20 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-4">Wystąpił problem</h2>
          <p className="text-[#DFD2B9] mb-8">
            {error}
          </p>
          <Link to="/" className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  if (isExpired && product.includes('Złota')) {
    return (
      <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
          <svg className="w-20 h-20 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-4">Link wygasł</h2>
          <p className="text-[#DFD2B9] mb-8">
            Link do pobrania Kopalni Złota jest ważny tylko przez {config.downloads.goldValidityHours} godziny i niestety wygasł.
          </p>
          <Link to="/" className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full border border-[#FFE8BE]/20"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-[#FFE8BE] mb-2 font-syne">Dziękujemy za zakup!</h2>
          <p className="text-[#DFD2B9]">
            Twoje zamówienie <span className="text-[#FFE8BE]">#{orderId}</span> zostało pomyślnie zrealizowane.
          </p>
        </div>

        <div className={`mb-8 p-6 rounded-xl ${product.includes('Złota') ? 'bg-[#50402B]/30' : 'bg-[#1E64D1]/30'} border ${product.includes('Złota') ? 'border-[#D5A44A]/30' : 'border-[#1E64D1]/30'}`}>
          <h3 className="font-bold text-lg text-white mb-3">{product}</h3>

          {/* Informacja o czasie dostępu */}
          <div className="mb-6">
            <p className="text-[#DFD2B9] text-sm">
              {product.includes('Złota') ? (
                <>
                  <span className="text-[#FFE8BE] block mb-2">Dostęp ważny {config.downloads.goldValidityHours} godziny</span>
                  {countdown && (
                    <div className="mt-2 p-2 bg-[#1A1814] rounded flex items-center justify-center">
                      <span className="text-[#FFE8BE] font-mono">Pozostało: {countdown}</span>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[#FFE8BE] block mb-2">Dostęp bezterminowy</span>
              )}
            </p>
          </div>

          {/* Przycisk pobrania */}
          <motion.a
            href={secureLink}
            download
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${product.includes('Złota') ? 'bg-[#D5A44A] hover:bg-[#c69643]' : 'bg-[#1E64D1] hover:bg-[#1851ac]'} text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Pobierz kurs teraz
          </motion.a>
        </div>

        {/* Informacje dodatkowe */}
        <div className="text-[#DFD2B9] text-sm">
          <p className="mb-4">
            Link do pobrania kursu został również wysłany na Twój adres email.
            {product.includes('Złota') ? ` Pamiętaj, że link będzie aktywny tylko przez ${config.downloads.goldValidityHours} godziny!` : ''}
          </p>

          {product.includes('Diamentów') && (
            <p className="mb-4">
              Dane dostępowe do zamkniętej grupy Discord zostaną wkrótce przesłane na Twój adres email.
            </p>
          )}

          <p className="mb-6">
            W razie problemów z pobraniem skontaktuj się z nami przez
            <Link to="/kontakt" className="text-[#FFE8BE] mx-1 hover:underline">stronę kontaktową</Link>
            lub bezpośrednio przez Discord.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-[#D5A44A] hover:underline">
            Wróć na stronę główną
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DownloadPage; 