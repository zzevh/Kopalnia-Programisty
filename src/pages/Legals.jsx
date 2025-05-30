import React, { useState } from 'react';

const REGULAMIN = (
  <>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">REGULAMIN SERWISU KOPALNIA PROGRAMISTY</h2>
    <ol className="list-decimal pl-6 space-y-4">
      <li>Właścicielem serwisu jest firma <strong>AureoTrade Mariusz Krupka ul. Zbigniewa Herberta 4/3, 42-224 Częstochowa Polska</strong>. NIP: 9491004152 REGON: 541440220 <a className='text-[#F6DDB2]' href="/kontakt">Kontakt: E-mail.</a></li>
      <li>Oferta dotyczy sprzedaży produktów cyfrowych – kursów online, m.in. „Kopalnia Złota" i „Kopalnia Diamentów".</li>
      <li>Zakup kursu oznacza dostęp do plików do pobrania. Warianty „na rok" i „na zawsze" oznaczają dostęp do linku do pobrania, nie do platformy online.</li>
      <li>Niektóre kursy zawierają dodatki: darmowe aktualizacje, mini-szkolenia, rabaty i kontakt bezpośredni – są to bonusy, a nie gwarantowane świadczenia.</li>
      <li>Płatności obsługuje zewnętrzny operator HotPay. Właściciel serwisu nie przechowuje danych kart i nie przetwarza płatności samodzielnie.</li>
      <li>Zgodnie z art. 38 pkt 13 Ustawy o prawach konsumenta, po zakupie produktu cyfrowego i uzyskaniu dostępu, nie przysługuje prawo do zwrotu.</li>
      <li>W przypadku problemów technicznych – możliwy jest kontakt bezpośredni. Staramy się rozwiązywać wszystko szybko i uczciwie.</li>
      <li>Właściciel serwisu nie ponosi odpowiedzialności za efekty zastosowania kursu. Materiały mają charakter edukacyjny i ich skuteczność zależy od użytkownika.</li>
      <li>Nazwy „Kopalnia Złota" oraz „Kopalnia Diamentów" są nazwami własnymi używanymi wyłącznie w celach marketingowych i edukacyjnych. Nie odnoszą się do rzeczywistych kopalni ani nie oznaczają sprzedaży lub udostępniania jakichkolwiek praw do obiektów fizycznych. Są to nazwy pakietów kursów online oferowanych przez Sprzedawcę.</li>
    </ol>
  </>
);


const POLITYKA = (
  <>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">POLITYKA PRYWATNOŚCI</h2>
    <ol className="list-decimal pl-6 space-y-4">
      <li>Administratorem danych osobowych jest firma <strong>AureoTrade</strong>. <a className='text-[#F6DDB2]' href="/kontakt">Kontakt: E-mail.</a></li>
      <li>Dane zbierane podczas korzystania ze strony to: e-mail, dane transakcyjne (przez HotPay), adres IP, dane techniczne przeglądarki oraz dane z Facebook Pixel.</li>
      <li>Dane są przetwarzane w celu: realizacji zamówienia, obsługi klienta, analizy ruchu, marketingu (reklamy Facebook/Meta/TikTok).</li>
      <li>Dane mogą być przekazywane następującym podmiotom: HotPay (płatności), Meta (Pixel), Vercel,TikTok.</li>
      <li>Użytkownik ma prawo do: dostępu do swoich danych, ich poprawienia, usunięcia, ograniczenia przetwarzania i zgłoszenia sprzeciwu.</li>
      <li>Strona korzysta z plików cookies. Możesz nimi zarządzać w ustawieniach przeglądarki.</li>
      <li>Dane są przetwarzane zgodnie z obowiązującym prawem (w tym RODO).</li>
    </ol>
  </>
);


const INFO = (
  <>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">DODATKOWE INFORMACJE</h2>
    <ul className="list-disc pl-6 space-y-4">
      <li>Podpunkt „Wszystko co jest opisane powyżej na stronie" oznacza materiały przypisane do konkretnego kursu („Kopalnia Złota" lub „Diamentów").</li>
      <li>Dostęp „na rok" lub „na zawsze" oznacza dostęp do linku do pobrania kursu. Nie obejmuje dostępu do platformy czy konta użytkownika.</li>
      <li>Może się jednak zdarzyć, że link do pobrania wygaśnie wcześniej z powodów technicznych (np. wygasające linki w chmurze, usunięcie plikow cookies itd.) W takich przypadkach nie ponosimy odpowiedzialności za brak możliwości pobrania, dlatego zdecydowanie zalecamy jak najszybsze pobranie materiałów po zakupie i ich zachowanie na własnym urządzeniu.</li>
      <li>Aktualizacje kursów są darmowe, ale ich dostępność nie jest gwarantowana.</li>
      <li>Mini-szkolenia mogą pojawić się w przyszłości, ale nie są gwarantowane (termin i forma zależne od dostępności).</li>
      <li>Rabaty na przyszłe produkty/kursy mogą być dostępne, ale nie są gwarantowane. Szczegóły (forma, procent, sposób dostarczenia) mogą się zmieniać.</li>
      <li>Bezpośredni kontakt z autorem kursu jest możliwy przez Discord (preferowane), Instagram lub e-mail.</li>
      <li>Kupując, akceptuje Regulamin, Politykę Prywatności oraz Dodatkowe Informacje o Produkcie, w tym brak możliwości odstąpienia od umowy po pobraniu produktu cyfrowego!</li>
      <li>Zgadzam się na natychmiastowe rozpoczęcie realizacji usługi (dostarczenie plików cyfrowych) i przyjmuję do wiadomości, że tracę prawo do odstąpienia od umowy.</li>
    </ul>
  </>
);


const Legals = () => {
  const [active, setActive] = useState('polityka');

  return (
    <div className="min-h-screen bg-[#0B0B09] text-[#DFD2B9] py-10 px-4 md:px-0 flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-8 w-full justify-center">
          <button
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-base md:text-lg transition ${active === 'polityka' ? 'bg-[#D19C4C] text-white' : 'bg-[#291F14] text-[#DFD2B9]'}`}
            onClick={() => setActive('polityka')}
          >
            Polityka Prywatności
          </button>
          <button
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-base md:text-lg transition ${active === 'regulamin' ? 'bg-[#D19C4C] text-white' : 'bg-[#291F14] text-[#DFD2B9]'}`}
            onClick={() => setActive('regulamin')}
          >
            Regulamin
          </button>
          <button
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-base md:text-lg transition ${active === 'info' ? 'bg-[#D19C4C] text-white' : 'bg-[#291F14] text-[#DFD2B9]'}`}
            onClick={() => setActive('info')}
          >
            Dodatkowe informacje
          </button>
        </div>
        <div className="bg-[#2E2112] rounded-2xl p-4 md:p-8 w-full shadow-lg border border-[#D19C4C]">
          {active === 'regulamin' && REGULAMIN}
          {active === 'polityka' && POLITYKA}
          {active === 'info' && INFO}
        </div>

        <div className="w-full mt-8 flex justify-center">
          <a
            href="/"
            className="bg-[#D19C4C] hover:bg-[#c69643] text-white font-semibold py-3 px-8 rounded-full transition-colors text-lg flex items-center justify-center w-full md:w-auto min-w-[200px] shadow-lg"
          >
            Wróć do strony głównej
          </a>
        </div>
      </div>
    </div>
  );
};

export default Legals; 