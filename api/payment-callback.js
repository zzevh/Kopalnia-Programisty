// Endpoint API dla obsługi powrotu z płatności HotPay

export default function handler(req, res) {
  // Ta funkcja jest używana tylko do przekierowania klienta po powrocie z bramki płatności

  try {
    console.log('Parametry powrotu z HotPay (payment-callback.js):', req.query);

    // Przekazujemy wszystkie parametry z pierwotnego żądania
    const searchParams = new URLSearchParams(req.query);

    // Jeśli mamy ID_ZAMOWIENIA z URL, ale nie mamy STATUS, sprawdzamy czy mamy testStatus
    const orderId = req.query.ID_ZAMOWIENIA;
    const status = req.query.STATUS;
    const testStatus = req.query.testStatus;

    // Dodajemy testStatus z adresu URL jeśli istnieje
    if (!status && testStatus) {
      console.log(`Wykryto testStatus=${testStatus} w adresie URL`);
      // Status testowy już jest w parametrach, nie dodajemy nic
    }
    // Jeśli przekazano status=FAILURE, dodajemy testStatus=FAILURE
    else if (status === 'FAILURE') {
      searchParams.set('testStatus', 'FAILURE');
      console.log('Dodano testStatus=FAILURE na podstawie status=FAILURE');
    }
    // Jeśli nie ma statusu ani testStatus, ale jest ID_ZAMOWIENIA
    else if (!status && !testStatus && orderId) {
      // Domyślnie nie dodajemy nic, obsługa po stronie React
      console.log('Brak status i testStatus, React obsłuży odzyskiwanie sesji');
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