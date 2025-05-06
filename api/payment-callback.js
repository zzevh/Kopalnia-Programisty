// Endpoint API dla obsługi powrotu z bramki płatności

export default function handler(req, res) {
  // Nagłówki CORS - ważne dla komunikacji między domenami
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Obsługa metody OPTIONS (preflight request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // W rzeczywistej implementacji tutaj byłaby weryfikacja płatności
    // Na razie po prostu przekierowujemy na stronę callback w aplikacji React

    // Pobierz parametry z zapytania
    const { STATUS, ID_ZAMOWIENIA, HASH } = req.query;

    // Logi dla debugowania
    console.log('API - Przekierowanie z HotPay:', { STATUS, ID_ZAMOWIENIA, HASH });

    // W trybie testowym HotPay może nie przekazywać parametrów, więc dodajemy domyślne
    // Jest to tylko dla trybu testowego, w produkcji HotPay zawsze powinien przekazywać parametry
    const finalStatus = STATUS || 'TEST_SUCCESS';

    // Przygotuj URL do przekierowania
    let redirectPath = '/payment/callback';
    const queryParams = [];

    if (finalStatus) queryParams.push(`STATUS=${finalStatus}`);
    if (ID_ZAMOWIENIA) queryParams.push(`ID_ZAMOWIENIA=${ID_ZAMOWIENIA}`);
    if (HASH) queryParams.push(`HASH=${HASH}`);

    if (queryParams.length > 0) {
      redirectPath += `?${queryParams.join('&')}`;
    }

    // Pełny URL przekierowania, używając absolute URL
    const host = req.headers.host || 'kopalnia-programisty.pl';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const fullRedirectUrl = `${protocol}://${host}${redirectPath}`;

    console.log('API - Przekierowuję do:', fullRedirectUrl);

    // Wykonaj przekierowanie
    return res.redirect(302, fullRedirectUrl);
  } catch (error) {
    console.error('Błąd podczas obsługi callbacku płatności:', error);
    // Przekieruj do głównej strony callbacku nawet w przypadku błędu
    return res.redirect(302, '/payment/callback');
  }
} 