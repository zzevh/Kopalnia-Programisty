import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import paymentService from '../services/paymentService';

const PaymentModal = ({ isOpen, onClose, product, price }) => {
  const [email, setEmail] = useState('');
  const [personName, setPersonName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('hotpay');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Reset stanu przy otwarciu modalu
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPersonName('');
      setPaymentMethod('hotpay');
      setFormError('');
    }
  }, [isOpen]);

  const validateForm = () => {
    // Sprawdzenie poprawności email
    if (!email) {
      setFormError('Adres email jest wymagany');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Podaj poprawny adres email');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja formularza
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      // Przygotowanie danych płatności
      const paymentData = {
        product,
        price,
        email,
        personName
      };

      // Generowanie danych formularza z wykorzystaniem produkcyjnego serwisu płatności
      const paymentFormData = paymentService.generatePaymentFormData(paymentData);

      // Tworzenie i wysyłanie formularza
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://platnosc.hotpay.pl/';
      form.style.display = 'none';

      // Dodajemy wszystkie parametry jako pola formularza
      Object.entries(paymentFormData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Dodajemy formularz do dokumentu i wysyłamy
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Błąd podczas inicjowania płatności:', error);
      setFormError('Wystąpił błąd podczas inicjowania płatności. Spróbuj ponownie później.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-[#23211E] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl z-10 border border-[#FFE8BE]/20 relative"
          >
            {/* Przycisk zamknięcia */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#FFE8BE]/70 hover:text-[#FFE8BE] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Nagłówek */}
            <div className={`p-6 text-white text-center ${product.includes('Złota') ? 'bg-gradient-to-r from-[#50402B] to-[#D5A44A]/40' : 'bg-gradient-to-r from-[#1E64D1] to-[#0597ff]/40'}`}>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold font-syne"
              >
                {product}
              </motion.h2>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold mt-2"
              >
                {price} PLN
              </motion.div>
            </div>

            {/* Formularz */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Komunikat o błędzie */}
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 rounded text-sm">
                  {formError}
                </div>
              )}

              {/* Pola formularza */}
              <div>
                <label htmlFor="email" className="block text-[#FFE8BE] text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1814] border border-[#FFE8BE]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFE8BE]/50 transition-colors"
                  placeholder="Twój adres email"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-[#FFE8BE] text-sm font-medium mb-1">Imię i nazwisko</label>
                <input
                  type="text"
                  id="name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full bg-[#1A1814] border border-[#FFE8BE]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFE8BE]/50 transition-colors"
                  placeholder="Twoje imię i nazwisko"
                />
              </div>

              {/* Metody płatności */}
              <div>
                <label className="block text-[#FFE8BE] text-sm font-medium mb-3">Metoda płatności</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border ${paymentMethod === 'hotpay' ? 'border-[#FFE8BE]' : 'border-[#FFE8BE]/20'} rounded-lg p-3 cursor-pointer transition-all hover:border-[#FFE8BE]/50 text-center`}
                    onClick={() => setPaymentMethod('hotpay')}
                  >
                    <div className="text-white font-medium">Blik/Przelewy/PayPal..</div>
                    <div className="text-[#D5A44A] text-xs mt-1">HotPay</div>
                  </div>

                  <div
                    className="border border-[#FFE8BE]/20 rounded-lg p-3 cursor-not-allowed bg-[#1A1814]/50 text-center opacity-50"
                  >
                    <div className="text-white font-medium">PaysafeCard</div>
                    <div className="text-[#D5A44A] text-xs mt-1">Chwilowo niedostępna</div>
                  </div>
                </div>
              </div>

              {/* Przycisk płatności */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full ${product.includes('Złota') ? 'bg-[#D5A44A] hover:bg-[#c69643]' : 'bg-[#1E64D1] hover:bg-[#1851ac]'} text-white font-medium py-3 rounded-lg transition-colors text-lg mt-6 flex items-center justify-center`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Przejdź do płatności"}
              </motion.button>

              {/* Informacja o bezpieczeństwie */}
              <div className="text-[#FFE8BE]/50 text-xs text-center mt-4">
                Twoja płatność jest przetwarzana bezpiecznie przez HotPay
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal; 