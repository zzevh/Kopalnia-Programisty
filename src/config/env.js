// Plik konfiguracyjny z danymi produkcyjnymi

export const config = {
  // HotPay - konfiguracja
  hotpay: {
    secret: "eTQrNllFZXFKYzVmeUZnUHlSeXpSUXg3WWU3L0RjR0Z6VG93VDR3Z0YwND0,", // Sekret z panelu HotPay
    notificationPassword: "bMarioTradETayCaN4s$", // Hasło notyfikacji z panelu HotPay
    notificationUrl: window.location.origin + "/api/payment-notification", // Zwróć uwagę na zmianę z "/api/payment/notification" na "/api/payment-notification"
    returnUrl: window.location.origin + "/payment/callback",
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
    url: window.location.origin,
    apiUrl: window.location.origin + "/api"
  },

  // Cloudinary - konfiguracja (darmowe przechowywanie plików)
  cloudinary: {
    cloudName: "dsifghp5z", // Uzupełnij po utworzeniu konta Cloudinary
    apiKey: "834784398848742",          // Uzupełnij po utworzeniu konta Cloudinary
    apiSecret: "bAScLyMntApWd5dgw8UKMMzmZHY",    // Uzupełnij po utworzeniu konta Cloudinary
    uploadPreset: "kopalnia-programisty" // Nazwa upload preset (bez uwierzytelniania)
  },

  // Konfiguracja dla pobierania plików
  downloads: {
    goldValidityHours: 24, // ważność linku dla Kopalni Złota w godzinach
    diamondValidityDays: 3650, // ważność linku dla Kopalni Diamentów w dniach (około 10 lat)

    // Ścieżki do plików w Cloudinary
    urls: {
      goldMine: "kopalnia-programisty/kopalnia-zlota",
      diamondMine: "kopalnia-programisty/kopalnia-diamentow"
    }
  }
} 