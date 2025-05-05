import paymentService from '../services/paymentService';
import { config } from '../config/env';

/**
 * Obsługuje notyfikację o płatności od HotPay
 * @param {Object} req - obiekt żądania
 * @param {Object} res - obiekt odpowiedzi
 */
export async function handlePaymentNotification(req, res) {
  try {
    // Pobierz dane z żądania
    const notificationData = req.body;

    // Weryfikacja adresu IP
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const isAllowedIp = config.hotpay.allowedIps.includes(clientIp);

    if (!isAllowedIp) {
      console.error(`Nieautoryzowany dostęp z IP: ${clientIp}`);
      return res.status(403).send('Unauthorized IP');
    }

    // Weryfikacja podpisu transakcji
    const isSignatureValid = paymentService.verifySignature(notificationData);

    if (!isSignatureValid) {
      console.error('Nieprawidłowa sygnatura transakcji');
      return res.status(400).send('Invalid signature');
    }

    // Przetwarzanie notyfikacji
    const { ID_ZAMOWIENIA, KWOTA, STATUS, EMAIL, ID_PLATNOSCI } = notificationData;

    // Pobierz dane produktu z sesji (w prawdziwym API byłoby to z bazy danych)
    const paymentData = sessionStorage.getItem(`payment_${ID_ZAMOWIENIA}`);

    if (!paymentData) {
      console.error(`Nie znaleziono danych płatności dla zamówienia: ${ID_ZAMOWIENIA}`);
      return res.status(404).send('Payment data not found');
    }

    const { product } = JSON.parse(paymentData);

    // Zapisz informacje o transakcji
    await paymentService.saveTransaction({
      orderId: ID_ZAMOWIENIA,
      product,
      status: STATUS,
      email: EMAIL,
      paymentId: ID_PLATNOSCI
    });

    // Jeśli płatność została zaakceptowana, generuj link do pobrania
    if (STATUS === 'SUCCESS') {
      // W rzeczywistym API link byłaby wysyłany e-mailem lub zapisywany w bazie
      const downloadLink = await paymentService.generateDownloadLink(product);

      // Zapisz link do pobrania (w rzeczywistości byłoby to w bazie danych)
      localStorage.setItem(`download_link_${ID_ZAMOWIENIA}`, downloadLink);
    }

    // Zwróć potwierdzenie przetworzenia notyfikacji
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);
    return res.status(500).send('Server error');
  }
}

/**
 * Inicjalizuje HTTP endpoint dla notyfikacji
 * @param {Object} app - instancja Express
 */
export function setupPaymentNotificationEndpoint(app) {
  app.post('/api/payment/notification', handlePaymentNotification);
} 