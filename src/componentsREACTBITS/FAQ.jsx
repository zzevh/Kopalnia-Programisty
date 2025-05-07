import React, { useState } from 'react';

const questions = [
  {
    q: 'Jak długo będę mieć dostęp do kursu?',
    a: 'Dostęp do kursu masz zawsze 24/7 i na zawsze. Pamiętaj jednak, że dostęp do pobrania pliku może się różnić w zależności od wybranego kursu. W przypadku "Kopalni Złota" link do pobrania może wygasnąć po roku, natomiast w przypadku "Kopalni Diamentów" link jest trwały i nie powinien wygasać. W obu przypadkach możesz korzystać z kursu wtedy, kiedy chcesz, bez stresu i pośpiechu.',
  },
  {
    q: 'Czy mogę się z Tobą skontaktować? (Przed zakupem też??)',
    a: 'Oczywiście! Niezależnie od tego, czy kupiłeś kurs, czy dopiero się zastanawiasz, możesz śmiało pisać. Wszystko znajdziesz w zakładce Kontakt. Odpisuję zawsze, jak tylko mogę!',
  },
  {
    q: 'Czy dostanę fakturę?',
    a: 'Tak, jasne! Jeśli potrzebujesz faktury, po prostu daj mi znać. Napisz wiadomość, podaj numer zamówienia i informację, że chcesz fakturę – i gotowe. Bez żadnego problemu!',
  },
  {
    q: 'Co potrzebuję, żeby wziąć udział w kursie?',
    a: 'Wystarczy Ci cokolwiek z dostępem do internetu – telefon, tablet, komputer… serio, nawet lodówka smart by dała radę 😉. Żadnych specjalnych wymagań – tylko chęci!',
  },
  {
    q: 'Czy mogę robić kurs w swoim tempie?',
    a: 'Pewnie, że tak! Wszystko jest uporządkowane tak, żebyś mógł iść krok po kroku, bez presji. Nie ma limitów czasowych, jedyne ograniczenie to czas pobrania plików: rok lub na zawsze, zależnie od pakietu, który wybierzesz.',
  },
  {
    q: 'Czy kurs jest trudny?',
    a: 'Nie! Zaczynamy od podstaw i idziemy krok po kroku. Wszystko tłumaczę prosto, jasno i bez lania wody. Jeśli czegoś nie zrozumiesz – wracasz, powtarzasz, pytasz. I jedziemy dalej!',
  },
  {
    q: 'Czy będę potrzebować jakiegoś oprogramowania?',
    a: 'Wystarczy, że Twój komputer będzie w stanie rozpakować plik .zip – a to potrafi praktycznie każdy system operacyjny, więc nie musisz się tym martwić. Dodatkowo, do wygodniejszego przeglądania materiałów może przydać się Figma – to darmowe narzędzie online, które działa w przeglądarce i nie wymaga instalacji. Jeśli w dalszej części kursu pojawią się jakieś dodatkowe narzędzia, dokładnie pokażę Ci co to za narzędzia, po co są potrzebne i jak ich używać. Wszystko będzie wyjaśnione prosto i zrozumiale – bez zbędnego technicznego żargonu.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="w-full flex flex-col gap-4">
      {questions.map((item, idx) => (
        <div key={idx}>
          <button
            className={`cursor-pointer w-full flex justify-between items-center text-left py-6 px-4 md:px-8 transition ${open === idx ? 'bg-[#50402B] border border-[#FFE8BE]/20 rounded-t-2xl rounded-b-none' : 'bg-[#272420] hover:bg-[#34240F] rounded-2xl'} font-bold text-xl md:text-2xl ${open === idx ? 'text-[#FFE8BE]' : 'text-[#DFD2B9]'}`}
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span className={open === idx ? 'font-extrabold' : ''}>{item.q}</span>
            <span className="ml-4 text-2xl">{open === idx ? '▴' : '▾'}</span>
          </button>
          {open === idx && (
            <div className="bg-[#34240F] rounded-b-2xl px-8 pb-8 text-[#DFD2B9] text-base md:text-lg animate-fadein border-t-0 border border-[#FFE8BE]/20">
              <br />
              <p>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;