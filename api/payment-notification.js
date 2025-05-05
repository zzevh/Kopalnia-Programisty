// Endpoint API dla notyfikacji płatności HotPay

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

  // Sprawdź metodę HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  try {
    // W rzeczywistej implementacji tutaj byłaby pełna walidacja i przetwarzanie płatności
    // Ale na potrzeby testów zwracamy sukces
    console.log('Otrzymano notyfikację płatności:', req.body);

    // Zwróć status 200 OK, aby HotPay nie ponawiał powiadomień
    return res.status(200).json({ status: 'SUCCESS' });
  } catch (error) {
    console.error('Błąd podczas przetwarzania notyfikacji płatności:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
} 