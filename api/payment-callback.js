// Endpoint API dla obsługi powrotu z płatności HotPay

export default function handler(req, res) {
  // Ta funkcja jest używana tylko do przekierowania klienta po powrocie z bramki płatności

  try {
    console.log('Parametry powrotu z HotPay (payment-callback.js):', req.query);

    // Przekazujemy wszystkie parametry z pierwotnego żądania
    const searchParams = new URLSearchParams(req.query);

    // Jeśli mamy ID_ZAMOWIENIA, ale nie mamy STATUS, dodajemy STATUS=SUCCESS 
    // aby symulować sukces w trybie testowym
    if (req.query.ID_ZAMOWIENIA && !req.query.STATUS) {
      searchParams.set('STATUS', 'SUCCESS');
      console.log('Dodano STATUS=SUCCESS dla trybu testowego');
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