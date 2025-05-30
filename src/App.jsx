import React, { useState } from 'react'
import odwroconelogo from './assets/odwroconelogo.png'
import stars from './assets/5star.png'

import ShinyText from './componentsREACTBITS/ShinyText';
import ScrollingBanner from './componentsREACTBITS/ScrollingBanner'
import FAQ from './componentsREACTBITS/FAQ'
import PaymentModal from './components/PaymentModal';

import r3 from './assets/opinie/3.png'
import r5 from './assets/opinie/5.jpg'
import r2 from './assets/opinie/2.png'
import r6 from './assets/opinie/6.png'
import r7 from './assets/opinie/7.jpg'
import r8 from './assets/opinie/8.png'
import r9 from './assets/opinie/9.png'
import r10 from './assets/opinie/10.png'
import r11 from './assets/opinie/11.jpg'
import r12 from './assets/opinie/12.jpg'
import r13 from './assets/opinie/13.jpg'


const App = () => {
  const [acceptGold, setAcceptGold] = useState(false);
  const [acceptDiamond, setAcceptDiamond] = useState(false);
  const [goldError, setGoldError] = useState(false);
  const [diamondError, setDiamondError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  const handleGoldClick = (e) => {
    if (!acceptGold) {
      e.preventDefault();
      setGoldError(true);
      setTimeout(() => setGoldError(false), 3000);
    } else {
      e.preventDefault();
      setSelectedProduct('Kopalnia Złota');
      setProductPrice('79');
      setShowPaymentModal(true);

      // Zapisz informacje o produkcie do localStorage
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem(`product_${orderId}`, JSON.stringify({
        name: 'Kopalnia Złota',
        price: '79'
      }));

      // TikTok Tracking Code - AddToCart event dla Kopalni Złota
      if (window.ttq) {
        window.ttq.track('AddToCart', {
          content_id: 'kopalnia-zlota',
          content_type: 'product',
          content_name: 'Kopalnia Złota',
          quantity: 1,
          price: 79,
          value: 79,
          currency: 'PLN',
          description: 'Kurs Kopalnia Złota',
          content_ids: ['kopalnia-zlota']
        });
      }
    }
  };

  const handleDiamondClick = (e) => {
    if (!acceptDiamond) {
      e.preventDefault();
      setDiamondError(true);
      setTimeout(() => setDiamondError(false), 3000);
    } else {
      e.preventDefault();
      setSelectedProduct('Kopalnia Diamentów');
      setProductPrice('129');
      setShowPaymentModal(true);

      // Zapisz informacje o produkcie do localStorage
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem(`product_${orderId}`, JSON.stringify({
        name: 'Kopalnia Diamentów',
        price: '129'
      }));

      // TikTok Tracking Code - AddToCart event dla Kopalni Diamentów
      if (window.ttq) {
        window.ttq.track('AddToCart', {
          content_id: 'kopalnia-diamentow',
          content_type: 'product',
          content_name: 'Kopalnia Diamentów',
          quantity: 1,
          price: 129,
          value: 129,
          currency: 'PLN',
          description: 'Kurs Kopalnia Diamentów',
          content_ids: ['kopalnia-diamentow']
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#141411] overflow-hidden">
      <main className="pb-12">
        <img src={odwroconelogo} alt="Logo" className="mx-auto -mb-5" />

        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-8xl font-extrabold text-[#FFE8BE] font-syne mb-8">
            Kopalnia <br /> Programisty
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            W "Kopalni Programisty" pokażę Ci krok po kroku, jak samodzielnie tworzyć własne projekty, wykorzystując sprawdzone narzędzia i strategie. Czekają na Ciebie konkretne przykłady, praktyczne wskazówki i wszystko bez zbędnego gadania.
          </p>
          <a href='#kurs' className="bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-10 py-3 rounded-full transition-colors text-lg cursor-pointer">
            Wodzę do Kopalni
          </a>
          <div>
            <img src={stars} alt="5 Gwiazdek opini" className='mx-auto mt-7 ' />
            <ShinyText text="30+ recenzji i stale rosnące zaufanie" disabled={false} speed={3} className='custom-class' />
          </div>
        </section>

        <ScrollingBanner />

        <div className="max-w-7xl mx-auto px-6 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-start gap-4 bg-[#272420] rounded-lg p-6 text-white h-full">
              <p className="text-4xl mb-2">
                📚
              </p>
              <h3 className="text-xl font-semibold text-[#FFE8BE] font-syne mb-2">
                Wszystko w jednym miejscu
              </h3>
              <p className="text-[#9F9A92]">
                Tworzenie własnych projektów i budowanie czegoś na własnych zasadach jest prostsze, niż się wydaje.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 bg-[#272420] rounded-lg p-6 text-white h-full">
              <p className="text-4xl mb-2">
                🚀
              </p>
              <h3 className="text-xl font-semibold text-[#FFE8BE] font-syne mb-2">
                Zacznij od podstaw
              </h3>
              <p className="text-[#9F9A92]">
                Nauczysz się wszystkiego od zera, bez doświadczenia, bez znajomości kodu, bez technicznego zaplecza.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 bg-[#272420] rounded-lg p-6 text-white h-full">
              <p className="text-4xl mb-2">
                💬
              </p>
              <h3 className="text-xl font-semibold text-[#FFE8BE] font-syne mb-2">
                Wsparcie techniczne
              </h3>
              <p className="text-[#9F9A92]">
                Zadawaj pytania, otrzymuj odpowiedzi i korzystaj z pomocy na każdym etapie.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 bg-[#272420] rounded-lg p-6 text-white h-full">
              <p className="text-4xl mb-2">
                💰
              </p>
              <h3 className="text-xl font-semibold text-[#FFE8BE] font-syne mb-2">
                Praktyczne rozwiązania
              </h3>
              <p className="text-[#9F9A92]">
                Kursy, które pomogą Ci zamieniać pomysły w realne działania i tworzyć coś, co działa na Ciebie nawet gdy odpoczywasz.
              </p>
            </div>
          </div>
        </div>

        <section id="warto" className="max-w-7xl mx-auto px-6 mt-24 mb-24">
          <div className="bg-[#34240F] rounded-2xl p-10 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-syne mb-12">
              Dlaczego warto?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>🚀</p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne"> Zaczynamy działać od razu</h3>
                  <p className="text-[#9F9A92]">Nie musisz kombinować. Dostajesz gotowy system, sprawdzone narzędzia i dokładne instrukcje krok po kroku.</p>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>📈</p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne">Wszystko przetestowane i działa</h3>
                  <p className="text-[#9F9A92]">Korzystasz z wiedzy i narzędzi, które naprawdę robią robotę, bez zgadywania, bez błądzenia.</p>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>🔍 </p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne">Wiedza z praktyki, nie z teorii</h3>
                  <p className="text-[#9F9A92]">Pokazuję rzeczy, które sam testowałem, to nie są ogólniki, tylko konkretne rozwiązania, które działają.</p>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>🔒</p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne">Próźno tego szukać w internecie!</h3>
                  <p className="text-[#9F9A92]">Dostajesz dostęp do materiałów, których nie znajdziesz tak łatwo w internecie a w szczegolnosci nie za darmo.</p>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>⏰</p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne">Aktualizacje i dostęp 24/7</h3>
                  <p className="text-[#9F9A92]">Masz dostęp do kursu o każdej porze i z każdego urządzenia na zawsze. A jeśli coś się zmieni, dostajesz aktualizacje za darmo.</p>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#432A17] border border-[#FFDAAA]/40 flex items-center justify-center">
                  <p>🤝 </p>
                </div>
                <div className="pt-16 pb-4">
                  <h3 className="text-xl font-semibold text-[#FFE8BE] mb-3 font-syne">Wspólnota, która pomoże ci urosnąć</h3>
                  <p className="text-[#9F9A92]">Zamknięta społeczność, wsparcie na Discordzie, wymiana doświadczeń i motywacja, nie działasz sam..</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="przewaga" className="max-w-7xl mx-auto px-6 mt-24 mb-24">
          <div className="bg-[#34240F] rounded-2xl p-10 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-syne mb-8">
              Twoja przewaga na starcie
            </h2>
            <p className="text-[#9F9A92] text-lg mb-12 max-w-3xl">
              Zamiast błądzić i tracić czas na szukanie informacji po forach i YouTubie, dostajesz gotowy system. Wszystko jest rozbite na jasne kroki, bez lania wody, bez zgadywania. Po prostu wchodzisz i działasz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[#D5A44A] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#34240F] font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D5A44A] font-syne">Start: Twoja własna kopalnia wiedzy</h3>
                </div>

                <div className="space-y-4 text-[#DFD2B9]">
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Pokażę ci sprawdzone platformy, z których korzystają profesjonalne agencje.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Dostaniesz gotową listę sprawdzonych dostawców usług online, którzy działają szybko i skutecznie.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Dowiesz się, jak działa rynek usług social media od środka, bez ściemniania.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Omówimy standardy jakości usług, żeby budować dobre relacje z klientami i reputację na rynku.</p>
                  </div>
                  <div>
                    <p>Jak wybierać oferty, żeby klienci wracali zamiast mieć pretensję.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[#D5A44A] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#34240F] font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D5A44A] font-syne">Sekretne zasady: Tajniki skutecznych działań</h3>
                </div>

                <div className="space-y-4 text-[#DFD2B9]">
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Udostępnię ci sprawdzoną wiedzą i kompletne poradniki, z których sam korzystałem, żeby zbudować swój sukces krok po kroku.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Zyskasz dostęp do materiałów, których próżno szukać w darmowym internecie. Konkret, wiedza i doświadczenie z pierwszej ręki.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Jak ogarniać wiele zleceń naraz i nie zwariować, proste systemy i checklisty.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Zobaczysz krok po kroku, jak konfigurować reklamy na Facebooku i Instagramie pod takie usługi.</p>
                  </div>
                  <div>
                    <p>Dowiesz się, jak wykorzystać darmowe narzędzia, żeby wyróżnić swoją ofertę na tle konkurencji.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[#D5A44A] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#34240F] font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D5A44A] font-syne">Twój pierwszy projekt krok po kroku</h3>
                </div>

                <div className="space-y-4 text-[#DFD2B9]">
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Pokażę ci, jak krok po kroku stworzyć stronę/landing, żeby zacząć zarabiać (nawet jak nie jesteś programistą).</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Dowiesz się, jak ogarniać zamówienia, komunikować się z klientami i automatyzować pracę.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Będzie też o błędach, które popełniłem na początku, żebyś ty ich już nie musiał popełniać!</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Jak skalować swój mały sklepik w coś, co przynosi stabilny przychód.</p>
                  </div>
                  <div>
                    <p>Przykłady realnych modeli działania, na serio, bez teoretyzowania.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[#D5A44A] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#34240F] font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D5A44A] font-syne">Praktyka bez ściemy: budujemy własny biznes</h3>
                </div>

                <div className="space-y-4 text-[#DFD2B9]">
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Pokażę ci, jak w praktyce wykorzystać całą zdobytą wiedzę i stworzyć własny pierwszy projekt.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Dowiesz się, jak przygotować opis, ofertę, ustalić ceny i skąd zdobywać pierwszych klientów.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Nauczysz się analizować wyniki, wyciągać wnioski i rozwijać się dalej bez stresu i chaosu.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Gdzie i jak szukać inspiracji, żeby tworzyć oferty, które naprawdę przyciągają klientów.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Jak zbudować profesjonalny wizerunek online (nawet bez pokazywania twarzy)</p>
                  </div>
                  <div>
                    <p>Budujemy razem krok po kroku caly biznes..</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#50402B] rounded-xl p-6 border border-[#FFE8BE]/20 relative col-span-1 md:col-span-2 lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[#D5A44A] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#34240F] font-bold">5</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#D5A44A] font-syne">Kontakt i bonusy</h3>
                </div>

                <div className="space-y-4 text-[#DFD2B9]">
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Będziesz mieć kontakt ze mną, pomoc, wsparcie, a nawet konsultacje w przykadku potrzeby.</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>W pełni gotowe wzory wiadomości+checklisty do klientów</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Rabaty na przyszłe produkty/kursy</p>
                  </div>
                  <div className="border-b border-[#9F9A92]/20 pb-3">
                    <p>Dostęp do przyszłych aktualizacji kursu</p>
                  </div>
                  <div>
                    <p>Wszystko uporządkowane i przygotowane tak, abyś działał, profesjonalnie i skutecznie.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='opinie' className="w-full mt-24 mb-24">
          <div className="bg-[#272420] p-10 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-syne text-center mb-4">
              Co sądzą inni?
            </h2>
            <p className="text-[#DFD2B9] text-center mb-12 text-base md:text-lg">
              Wiele osób zostawiło naprawdę ciepłe słowa. Warto sprawdzić, co dokładnie! <br />Sporo osób już się wypowiedziało, a ich opinie są bardzo pozytywne. Zgadnij, dlaczego! 🤔😎
            </p>

            <div className="grid gap-4 max-w-4xl mx-auto">

              <div className="border-[#23211E] border rounded-xl col-span-1 md:col-span-2 overflow-hidden relative">
                <img src={r3} alt="opinia" className="w-full" />
              </div>

              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r2} alt="opinia" className="w-full" />
              </div>

              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r6} alt="opinia" className="w-full" />
              </div>

              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r5} alt="opinia" className="w-full" />
              </div>

              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r12} alt="opinia" className="w-full" />
              </div>
              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r8} alt="opinia" className="w-full" />
              </div>
              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r7} alt="opinia" className="w-full" />
              </div>
              <div className="border-[#23211E] border rounded-xl col-span-1 md:col-span-2 overflow-hidden relative">
                <img src={r10} alt="opinia" className="w-full" />
              </div>
              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r11} alt="opinia" className="w-full" />
              </div>
              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r9} alt="opinia" className="w-full" />
              </div>
              <div className="bg-[#23211E] rounded-xl overflow-hidden relative">
                <img src={r13} alt="opinia" className="w-full" />
              </div>

            </div>
          </div>
        </section>

        <section id='kurs' className="max-w-7xl mx-auto px-6 mt-24 mb-24">
          <div className="bg-[#34240F] rounded-2xl p-6 md:p-10 border-[#6b4a2d] border">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-syne mb-4 text-center">
              Wybierz kurs
            </h2>
            <p className="text-[#9F9A92] text-center mb-12 max-w-3xl mx-auto">
              Czas na wybór! Dwa pakiety, a mnóstwo możliwości. <br /> Po prostu wybierz ten, który najbardziej Ci pasuje i zaczynamy! 😎
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="bg-[#50402B] rounded-xl p-8 border border-[#FFE8BE]/20 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-[#FFE8BE] font-syne mb-4 text-center">Kopalnia Złota</h3>
                <div className="text-5xl font-extrabold text-[#FFE8BE] mb-6 font-syne text-center">79 <br /> <span className="text-base font-normal font-inter text-[#D5D5D5]">PLN BRUTTO</span></div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>

                    <span className="text-[#DFD2B9] -ml-2">Konkretna dawka wiedzy w 5 modułach.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#DFD2B9] -ml-2">Praktyczne poradniki, gotowe linki i instrukcje krok po kroku.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#DFD2B9] -ml-2">Jeden zaawansowany i rozbudowany projekt w Figma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#DFD2B9] -ml-2">Dostęp 24/7 na rok.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#DFD2B9] -ml-2">Bezpośredni i stały kontakt ze mną.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFBD33] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-[#DFD2B9] -ml-2">Wszystko co jest opisane powyzej na stronie.</span>
                  </div>
                </div>

                <div className="flex-1"></div>
                <div className="mt-auto">
                  <a
                    href="#"
                    onClick={handleGoldClick}
                    className={`w-full bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium py-3 rounded-full transition-colors text-lg block text-center mb-3 ${!acceptGold ? 'opacity-50' : ''}`}
                  >
                    Kup Kopalnię Złota
                  </a>
                  {goldError && (
                    <div className="text-red-500 text-xs text-center font-medium mb-2 animate-pulse">
                      Aby kontynuować, zaznacz poniższy checkbox.
                    </div>
                  )}
                  <div className="flex items-start mt-3">
                    <input
                      type="checkbox"
                      checked={acceptGold}
                      onChange={e => {
                        setAcceptGold(e.target.checked);
                        if (e.target.checked) setGoldError(false);
                      }}
                      className="w-6 h-6 mr-2 accent-[#D5A44A] mt-0.5 cursor-pointer"
                      id="acceptGold"
                    />
                    <label htmlFor="acceptGold" className="text-[#DFD2B9] text-xs leading-tight cursor-pointer">
                      Zapoznałem/am się i akceptuję
                      <a href="/legals" className="inline-block mx-1 px-1 text-[#FFE8BE]">Regulamin</a>,
                      <a href="/legals" className="inline-block mx-1 px-1 text-[#FFE8BE]">Politykę Prywatności</a> oraz
                      <a href="/legals" className="inline-block mx-1 px-1 text-[#FFE8BE]">Dodatkowe informacje</a>.

                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E64D1] rounded-xl p-8 border border-[#FFE8BE]/20 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white font-syne mb-4 text-center">Kopalnia Diamentów</h3>
                <div className="text-5xl font-extrabold text-white mb-6 text-center font-syne">129  <br /> <span className="text-base font-normal font-inter text-[#D5D5D5]">PLN BRUTTO</span></div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">Dostęp 24/7 na zawsze</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">Stały dostęp do zamkniętej grupy Discord</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">3 Zaawansowane i rozbudowane projekty w Figma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">Darmowe aktualizacje wszystkich materiałów oraz dostęp do przyszłych mini-szkoleń.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">W pełni gotowe wzory wiadomości+checklisty do klientów</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0597ff] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">Rabaty na przyszłe produkty/kursy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#CCDEFD] rounded-full flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-[#0058F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white -ml-2">Wszystko z "Kopalnia Złota"</span>
                  </div>
                </div>

                <div className="flex-1"></div>
                <div className="mt-auto">
                  <a
                    href="#"
                    onClick={handleDiamondClick}
                    className={`w-full bg-white hover:bg-gray-100 text-[#1E64D1] font-medium py-3 rounded-full transition-colors text-lg block text-center mb-3 ${!acceptDiamond ? 'opacity-50' : ''}`}
                  >
                    Kup Kopalnię Diamentów
                  </a>
                  {diamondError && (
                    <div className="text-red-500 text-xs text-center font-medium mb-2 animate-pulse">
                      Aby kontynuować, zaznacz poniższy checkbox.
                    </div>
                  )}
                  <div className="flex items-start mt-3">
                    <input
                      type="checkbox"
                      checked={acceptDiamond}
                      onChange={e => {
                        setAcceptDiamond(e.target.checked);
                        if (e.target.checked) setDiamondError(false);
                      }}
                      className="w-6 h-6 mr-2 accent-[#1E64D1] mt-0.5 cursor-pointer"
                      id="acceptDiamond"
                    />
                    <label htmlFor="acceptDiamond" className="text-white text-xs leading-tight cursor-pointer">
                      Zapoznałem/am się i akceptuję
                      <a href="/legals" className="inline-block mx-1 px-1 text-white">Regulamin</a>,
                      <a href="/legals" className="inline-block mx-1 px-1 text-white">Politykę Prywatności</a> oraz
                      <a href="/legals" className="inline-block mx-1 px-1 text-white">Dodatkowe informacje</a>.

                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 md:w-[99%] mx-auto">
              <p className="text-[#d1c0a7] text-sm md:text-base mb-8">
                *W skrócie, w tym kursie dowiesz się, jak wykorzystać swój potencjał i przekształcić czas spędzany na telefonie czy komputerze w coś, co naprawdę ma wartość. Pokażę Ci krok po kroku, jak uniknąć błędów, które ja popełniałem na początku, oraz jak skutecznie rozwijać swoje umiejętności. Bez zbędnego lania wody, przejdziemy przez wszystkie etapy, aż do stworzenia Twojego pierwszego projektu. Skupimy się na konkretnych działaniach, które prowadzą do realnych rezultatów, budując solidne fundamenty do rozwoju własnego biznesu. Wszystko jasno, zrozumiale i praktycznie – nie musisz się martwić, że coś zostanie niezrozumiane.
              </p>
              <a href="/allproducts" className="block w-full md:w-[100%] mx-auto bg-[#3A332A] hover:bg-[#50402B] text-[#DFD2B9] text-center font-medium py-3 rounded-full transition-colors text-base md:text-lg">
                Zobacz inne kursy i poradniki
              </a>
            </div>
          </div>
        </section>

        <section id='podglad' className="max-w-7xl mx-auto px-6 mt-24 mb-24">
          <div className="bg-[#34240F] rounded-2xl p-6 md:p-10 border-[#6b4a2d] border">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-syne mb-4 text-center">
              Podgląd kursu
            </h2>
            <p className="text-[#9F9A92] text-center mb-12 max-w-3xl mx-auto">
              Sprawdź, co dokładnie otrzymasz w każdym pakiecie. <br /> Poniżej znajdziesz szczegółowy opis zawartości kursów.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kopalnia Złota */}
              <div className="bg-[#50402B] rounded-xl p-8 border border-[#FFE8BE]/20">
                <h3 className="text-2xl font-bold text-[#FFE8BE] font-syne mb-6 text-center">Kopalnia Złota - zawartość</h3>



                <div className="space-y-4 mb-8">
                  <div className="bg-[#3A2E1C] p-4 rounded-lg">
                    <h4 className="text-[#D5A44A] font-semibold mb-2 text-lg">Struktura folderu:</h4>
                    <p className="text-[#DFD2B9] mb-2">W jednym folderze znajdują się 3 pliki:</p>
                    <ul className="list-disc pl-5 text-[#DFD2B9] space-y-1">
                      <li>1 × plik Markdown (.md)</li>
                      <li>1 × plik PDF</li>
                      <li>1 × plik Figma (JAM)</li>
                    </ul>
                  </div>

                  <div className="bg-[#3A2E1C] p-4 rounded-lg">
                    <h4 className="text-[#D5A44A] font-semibold mb-2 text-lg">Zawartość:</h4>
                    <ul className="list-disc pl-5 text-[#DFD2B9] space-y-2">
                      <li>Plik do kontaktu</li>
                      <li>Zaawansowany plik kursu PDF z 6 stronami (w tym 5 modułów, w tym około 20 "podtematów"!)</li>
                      <li>Zaawansowany plik kursu Figma (JAM) zawierający jeden kompletny lejek</li>
                    </ul>
                  </div>


                </div>
              </div>

              {/* Kopalnia Diamentów */}
              <div className="bg-[#1c2e50] rounded-xl p-8 border border-[#C4D7F5]/20">
                <h3 className="text-2xl font-bold text-white font-syne mb-6 text-center">Kopalnia Diamentów - zawartość</h3>



                <div className="space-y-4 mb-8">
                  <div className="bg-[#15233d] p-4 rounded-lg">
                    <h4 className="text-[#3a8eff] font-semibold mb-2 text-lg">Struktura folderu:</h4>
                    <p className="text-white mb-2">W jednym folderze znajduje się 6 plików:</p>
                    <ul className="list-disc pl-5 text-white space-y-1">
                      <li>2 × pliki Markdown (.md)</li>
                      <li>1 × plik PDF</li>
                      <li>3 × pliki Figma (JAM)</li>
                    </ul>
                  </div>

                  <div className="bg-[#15233d] p-4 rounded-lg">
                    <h4 className="text-[#3a8eff] font-semibold mb-2 text-lg">Zawartość:</h4>
                    <ul className="list-disc pl-5 text-white space-y-2">
                      <li>Plik do kontaktu</li>
                      <li>Plik z dostępem do zamkniętej grupy Discord</li>
                      <li>Zaawansowany plik kursu PDF z 8 stronami (w tym 7 modułów, w tym około 26 "podtematów")</li>
                      <li>Zaawansowane pliki kursu Figma (JAM) zawierające:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Kompletny lejek</li>
                          <li>3 × Case-study</li>
                          <li>2 × szablony informacji o sobie</li>
                          <li>Tipy od Figma</li>
                          <li>Szablony spotkań (meeting info, topic, next steps)</li>
                          <li>Przeszłe spotkania (past meeting, meeting info, topic, next steps)</li>
                          <li>System zarządzania zadaniami (todo, in progress, in review, completed, backlog)</li>
                        </ul>
                      </li>
                      <li>FIGALL - wszystkie pliki Figma w jednym!</li>
                    </ul>
                  </div>


                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <a href="#kurs" className="inline-block mb-4 bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-10 py-3 rounded-full transition-colors text-lg">
                Wybierz swój pakiet
              </a>
              <br />
              <a className='text-gray-300 hover:text-gray-100 transition-all' href="#opinie">Sprawdz co sądzą inni i ich efekty!</a>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 md:px-0 mt-24 mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold font-syne text-[#fff] mb-12 text-left md:text-center" style={{ letterSpacing: '-2px' }}>Może masz pytanie?</h2>
          <FAQ />
        </section>
      </main>

      {/* Modal płatności */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        price={productPrice}
      />
    </div>
  )
}

export default App