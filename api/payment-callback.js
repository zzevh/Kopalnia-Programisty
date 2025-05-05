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

  // W rzeczywistej implementacji tutaj byłaby weryfikacja płatności
  // Na razie po prostu przekierowujemy na stronę główną z odpowiednimi parametrami

  // Pobierz parametry z zapytania
  const { STATUS, ID_ZAMOWIENIA } = req.query;

  // Przekieruj na stronę główną z parametrami
  const redirectUrl = new URL('/payment/callback', process.env.VERCEL_URL || 'https://kopalnia-programisty.pl');
  redirectUrl.searchParams.append('STATUS', STATUS || 'UNKNOWN');
  redirectUrl.searchParams.append('ID_ZAMOWIENIA', ID_ZAMOWIENIA || '');

  // Przekieruj użytkownika
  return res.redirect(302, redirectUrl.toString());
} 