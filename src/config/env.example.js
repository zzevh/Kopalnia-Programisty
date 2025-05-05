// Przykładowy plik konfiguracyjny - skopiuj do env.js i uzupełnij właściwe dane

export const config = {
  // HotPay - konfiguracja
  hotpay: {
    secret: "twoj_sekret_hotpay",
    notificationPassword: "twoje_haslo_notyfikacji",
    notificationUrl: "https://api.twoja-domena.pl/api/payment/notification",
    returnUrl: "https://twoja-domena.pl/payment/callback",
    allowedIps: [
      "18.197.55.26",
      "3.126.108.86",
      "3.64.128.101",
      "18.184.99.42",
      "3.72.152.155",
      "35.159.7.168"
    ]
  },

  // Adres URL aplikacji
  app: {
    url: "https://twoja-domena.pl",
    apiUrl: "https://api.twoja-domena.pl"
  },

  // Firebase - konfiguracja (dla zabezpieczenia dostępu do plików)
  firebase: {
    apiKey: "twoj_api_key",
    authDomain: "twoj_projekt.firebaseapp.com",
    projectId: "twoj_projekt",
    storageBucket: "twoj_projekt.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
  },

  // Konfiguracja dla pobierania plików
  downloads: {
    goldValidityHours: 24, // ważność linku dla Kopalni Złota w godzinach
    diamondValidityDays: 3650, // ważność linku dla Kopalni Diamentów w dniach (około 10 lat)

    // Ścieżki do plików w Firebase Storage
    paths: {
      goldMine: "downloads/kopalnia-zlota.zip",
      diamondMine: "downloads/kopalnia-diamentow.zip"
    }
  }
} 