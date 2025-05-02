import React, { useState } from 'react';

const questions = [
  {
    q: 'Jak długo będę mieć dostęp do kursu?',
    a: 'To zależy od pakietu, który wybierzesz. W wersji "Kopalnia Złota" masz dostęp 24/7 przez rok, a w "Kopalni Diamentów" – 24/7 na zawsze. W obu przypadkach możesz korzystać z kursu wtedy, kiedy chcesz, bez stresu i pośpiechu.',
  },
  {
    q: 'Czy mogę się z Tobą skontaktować? (Przed zakupem tez??)',
    a: 'Oczywiście! Niezależnie od tego, czy kupiłeś kurs, czy dopiero się zastanawiasz, możesz śmiało pisać. Instagram, Discord, mail – wszystko znajdziesz w zakładce Kontakt. Odpisuję zawsze, jak tylko mogę!',
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
    a: 'Pewnie, że tak! Wszystko jest uporządkowane tak, żebyś mógł iść krok po kroku, bez presji. Nie ma limitów czasowych – jedyne ograniczenie to czas dostępu do plików: rok lub na zawsze, zależnie od pakietu, który wybierzesz.',
  },
  {
    q: 'Czy kurs jest trudny?',
    a: 'Nie! Zaczynamy od podstaw i idziemy krok po kroku. Wszystko tłumaczę prosto, jasno i bez lania wody. Jeśli czegoś nie zrozumiesz – wracasz, powtarzasz, pytasz. I jedziemy dalej!',
  },
  {
    q: 'Czy będę potrzebować jakiegoś oprogramowania?',
    a: 'Nie musisz nic instalować na start. Jeśli w dalszej części kursu będą potrzebne jakieś narzędzia, pokażę Ci dokładnie co, po co i jak ich używać. Wszystko będzie wytłumaczone po ludzku.',
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