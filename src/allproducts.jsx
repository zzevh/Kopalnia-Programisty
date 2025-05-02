import React from 'react';
import { Link } from 'react-router-dom';

const AllProducts = () => (
  <div className="min-h-screen bg-[#141411] flex flex-col justify-center items-center px-4">
    <div className="bg-[#23211E] rounded-2xl shadow-lg p-8 max-w-xl w-full text-center border border-[#FFE8BE]/20">
      <h1 className="text-3xl md:text-5xl font-semibold text-[#FFE8BE] font-syne mb-6">Inne produkty nie są jeszcze dostępne</h1>
      <p className="text-[#DFD2B9] text-lg mb-8">
        Jeśli chcesz zobaczyć kurs <span className="text-[#D5A44A] font-bold">Kopalnia Programisty: Złota</span> lub <span className="text-[#1E64D1] font-bold">Diamentów</span>, wróć do strony głównej!
      </p>
      <Link to="/" className="inline-block bg-[#D5A44A] hover:bg-[#c69643] text-white font-medium px-8 py-3 rounded-full transition-colors text-lg">Wróć na stronę główną</Link>
    </div>
  </div>
);

export default AllProducts; 