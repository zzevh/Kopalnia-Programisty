// Plik konfiguracyjny z danymi produkcyjnymi

// Określamy URL domeny
const BASE_URL = "https://kopalnia-programisty.pl";

export const config = {
  // HotPay - konfiguracja
  hotpay: {
    secret: "eTQrNllFZXFKYzVmeUZnUHlSeXpSUXg3WWU3L0RjR0Z6VG93VDR3Z0YwND0,", // Sekret z panelu HotPay
    notificationPassword: "bMarioTradETayCaN4s$", // Hasło notyfikacji z panelu HotPay
    notificationUrl: BASE_URL + "/api/payment-notification",
    returnUrl: BASE_URL + "/api/payment-callback", // Zwróć uwagę na adres do API, nie do komponentu React
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
    url: BASE_URL,
    apiUrl: BASE_URL + "/api"
  },

  // Cloudinary - konfiguracja (darmowe przechowywanie plików)
  cloudinary: {
    cloudName: "dsifghp5z",
    apiKey: "834784398848742",
    apiSecret: "bAScLyMntApWd5dgw8UKMMzmZHY",
    uploadPreset: "kopalnia-programisty"
  },

  // Konfiguracja dla pobierania plików
  downloads: {
    goldValidityHours: 24, // ważność linku dla Kopalni Złota w godzinach
    diamondValidityDays: 3650, // ważność linku dla Kopalni Diamentów w dniach (około 10 lat)

    // Ścieżki do plików w Cloudinary
    urls: {
      goldMine: "kopalnia-programisty/kopalnia-zlota_l3a4vg",
      diamondMine: "kopalnia-programisty/kopalnia-diamentow_b5zpb4"
    }
  }
} 