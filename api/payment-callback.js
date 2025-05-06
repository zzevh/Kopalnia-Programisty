// Endpoint API dla obsługi powrotu z płatności HotPay

export default function handler(req, res) {
  // Obsługa przekierowania klienta po powrocie z bramki płatności HotPay

  try {
    console.log('Parametry powrotu z HotPay (payment-callback.js):', req.query);

    // Przekazujemy parametry z query do naszego komponentu
    const searchParams = new URLSearchParams();

    // Wyodrębniamy parametry z HotPay
    const orderId = req.query.ID_ZAMOWIENIA;
    const status = req.query.STATUS;
    const hash = req.query.HASH;
    const secure = req.query.SECURE;

    // Przekazujemy parametry do naszego komponentu
    if (orderId) searchParams.set('orderId', orderId);
    if (status) searchParams.set('status', status);
    if (hash) searchParams.set('hash', hash);
    if (secure) searchParams.set('secure', secure);

    // W trybie produkcyjnym HotPay przekazuje status płatności
    // Używamy go bezpośrednio bez modyfikacji
    if (status) {
      console.log(`Otrzymano status płatności od HotPay: ${status}`);
    } else {
      console.log('Brak statusu płatności w parametrach');
    }

    // Używamy stałego URL dla przekierowania
    const baseUrl = process.env.SITE_URL || 'https://kopalnia-programisty.pl';
    const redirectUrl = `${baseUrl}/payment/callback?${searchParams.toString()}`;

    console.log('Przekierowanie na:', redirectUrl);

    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Błąd podczas obsługi callback:', error);

    // W przypadku błędu także przekierowujemy na stronę statusu, ale z informacją o błędzie
    const baseUrl = process.env.SITE_URL || 'https://kopalnia-programisty.pl';
    return res.redirect(302, `${baseUrl}/payment/callback?error=server_error`);
  }
} 