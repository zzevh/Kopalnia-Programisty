// Endpoint API dla obsługi powrotu z płatności HotPay

export default function handler(req, res) {
  // Ta funkcja jest używana tylko do przekierowania klienta po powrocie z bramki płatności
  // Faktyczne przetwarzanie płatności odbywa się w payment-notification.js

  // Przekierowanie użytkownika na stronę z informacją o statusie płatności
  // Dodajemy wszystkie otrzymane parametry jako query params
  const queryParams = new URLSearchParams(req.query).toString();
  const redirectUrl = `${process.env.SITE_URL || 'https://kopalnia-programisty.pl'}/payment/callback?${queryParams}`;

  return res.redirect(302, redirectUrl);
} 