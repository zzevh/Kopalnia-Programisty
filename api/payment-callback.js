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
    console.log('Przekierowanie z HotPay:', { STATUS, ID_ZAMOWIENIA, HASH });

    // Przygotuj URL do przekierowania
    let redirectPath = '/payment/callback';
    const queryParams = [];

    if (STATUS) queryParams.push(`STATUS=${STATUS}`);
    if (ID_ZAMOWIENIA) queryParams.push(`ID_ZAMOWIENIA=${ID_ZAMOWIENIA}`);
    if (HASH) queryParams.push(`HASH=${HASH}`);

    if (queryParams.length > 0) {
      redirectPath += `?${queryParams.join('&')}`;
    }

    // Pełny URL przekierowania
    const fullRedirectUrl = `${process.env.VERCEL_URL || 'https://kopalnia-programisty.pl'}${redirectPath}`;
    console.log('Przekierowuję do:', fullRedirectUrl);

    // Wykonaj przekierowanie
    return res.redirect(302, fullRedirectUrl);
  } catch (error) {
    console.error('Błąd podczas obsługi callbacku płatności:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
} 