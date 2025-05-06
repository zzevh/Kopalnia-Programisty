// Endpoint API dla obsługi powrotu z płatności HotPay

export default function handler(req, res) {
  // Ta funkcja jest używana tylko do przekierowania klienta po powrocie z bramki płatności

  try {
    console.log('Parametry powrotu z HotPay (payment-callback.js):', req.query);

    // Przekazujemy wszystkie parametry z pierwotnego żądania
    const searchParams = new URLSearchParams();

    // Wyodrębniamy potrzebne parametry
    const orderId = req.query.ID_ZAMOWIENIA;
    const status = req.query.STATUS;
    const hash = req.query.HASH;
    const secure = req.query.SECURE;
    const error = req.query.error;
    const testStatus = req.query.testStatus;

    // Dodajemy parametry w formacie, który zrozumie nasz komponent
    if (orderId) searchParams.set('orderId', orderId);
    if (status) searchParams.set('status', status);
    if (hash) searchParams.set('hash', hash);
    if (secure) searchParams.set('secure', secure);
    if (error) searchParams.set('error', error);

    // Dodajemy testStatus z adresu URL jeśli istnieje
    if (testStatus) {
      console.log(`Wykryto testStatus=${testStatus} w adresie URL`);
      searchParams.set('testStatus', testStatus);
    }
    // Jeśli przekazano status=FAILURE, dodajemy testStatus=FAILURE
    else if (status === 'FAILURE') {
      searchParams.set('testStatus', 'FAILURE');
      console.log('Dodano testStatus=FAILURE na podstawie status=FAILURE');
    }
    // Jeśli mamy sukces, ustawiamy testStatus=SUCCESS
    else if (status === 'SUCCESS') {
      searchParams.set('testStatus', 'SUCCESS');
      console.log('Dodano testStatus=SUCCESS na podstawie status=SUCCESS');
    }
    // Jeśli nie ma statusu ani testStatus, ale jest ID_ZAMOWIENIA
    else if (!status && !testStatus && orderId) {
      // Dla trybu testowego dodajemy domyślnie testStatus=SUCCESS
      searchParams.set('testStatus', 'SUCCESS');
      console.log('Brak status i testStatus, zakładam testStatus=SUCCESS');
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