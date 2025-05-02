import React from 'react';
import logobanner from '../assets/logobanner.png'

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#D49C38] bg-[#0B0B09] text-[#888] pt-12 pb-6 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-start gap-12 md:gap-0">
        {/* Lewa strona */}
        <div className="flex-1 min-w-[250px] flex flex-col items-center md:items-start text-center md:text-left">
          <a href="/">
            <img src={logobanner} className='w-85 mx-auto md:mx-0' alt="Logo Kopalnia Programisty" />
          </a>
          <div className="text-sm text-[#888] mt-8">© 2025 Kopalnia Programisty. All Rights Reserved.</div>
        </div>
        {/* Prawa strona */}
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-center md:justify-start w-full md:w-auto">
          <div>
            <div className="font-bold text-white mb-2 mt-8 md:mt-0">Links</div>
            <ul className="space-y-1 text-center md:text-left">
              <li><a href="#" className="hover:text-white transition">Dlaczego warto</a></li>
              <li><a href="#" className="hover:text-white transition">Zobacz Kursy</a></li>
              <li><a href="#" className="hover:text-white transition">O autorze</a></li>
              <li><a href="#" className="hover:text-white transition">Otwórz Kopalnię</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white mb-2 mt-8 md:mt-0">Legals</div>
            <ul className="space-y-1 text-center md:text-left">
              <li><a href="/legals" className="hover:text-white transition">Regulamin</a></li>
              <li><a href="/legals" className="hover:text-white transition">Polityka Prywatności</a></li>
              <li><a href="/legals" className="hover:text-white transition">Dodatkowe informacje</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 