import React from 'react';
import logo from '../assets/logo.png';

const ScrollingBanner = () => {
  // Powtarzanie tekstu kilka razy, aby zapewnić ciągłość animacji
  const bannerText = (
    <>
      <span className="text-[#FFE8BE] text-xl sm:text-2xl font-semibold font-syne mx-4">Nie musisz umieć kodować!</span>
      <img src={logo} alt="logo" className="inline-block h-7 w-7 mx-4" />
      <span className="text-[#FFE8BE] text-xl sm:text-2xl font-semibold mx-4 font-syne">Bez stresu i bez presji</span>
      <img src={logo} alt="logo" className="inline-block h-7 w-7 mx-4" />
      <span className="text-[#FFE8BE] text-xl sm:text-2xl font-semibold mx-4 font-syne">Buduj swoje projekty na własnych zasadach.</span>
      <img src={logo} alt="logo" className="inline-block h-7 w-7 mx-4" />
    </>
  );

  return (
    <div className="w-full bg-[#603F11] overflow-hidden" style={{ transform: 'rotate(4deg)' }}>
      <div className="text-center py-3 flex items-center scrolling-banner">
        {bannerText}
        {bannerText}
      </div>
    </div>
  );
};

export default ScrollingBanner; 