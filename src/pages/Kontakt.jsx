import React from 'react';

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-[#0B0B09] text-[#DFD2B9] py-16 px-4 md:px-0 flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-[#FFE8BE] mb-8 text-center">Kontakt</h1>
        <div className="bg-[#291F14] rounded-2xl p-8 w-full shadow-lg border border-[#D19C4C] text-lg md:text-xl">
          <p className="mb-4">Masz pytania, chcesz się skonsultować lub po prostu pogadać? Skontaktuj się ze mną przez jedną z poniższych opcji:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><b>Discord:</b> <span className="text-[#FFE8BE]">zzehv</span></li>
            <li><b>Instagram:</b> <a href="https://instagram.com/nah.zzehv" target="_blank" rel="noopener noreferrer" className="text-[#FFE8BE] underline">@nah.zzehv</a></li>
            <li><b>Email:</b> <a href="mailto:aureotradecompany@gmail.com" className="text-[#FFE8BE] underline">aureotradecompany@gmail.com</a></li>
          </ul>
          <p className="mt-6">Odpowiadam najszybciej jak mogę! 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Kontakt; 