// Endpoint API dla obsługi powrotu z bramki płatności

export default function handler(req, res) {
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