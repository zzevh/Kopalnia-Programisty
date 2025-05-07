"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-[#0B0B09] px-6 py-4 w-full border-b border-[#D49C38] ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="#warto" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
            Dlaczego warto
          </a>
          <a href="#przewaga" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
            Twoja przewaga
          </a>
          <a href="/allproducts" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
            Zobacz kursy z programowania
          </a>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* CTA Button */}
        <a
          href="#kurs"
          className="hidden md:block bg-[#D5A44A] hover:bg-[#c69643] text-white font-semibold font-inter px-6 py-2 rounded-full transition-colors"
        >
          Wodzę do Kopalni
        </a>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-3 px-4 bg-[#1f1c16] rounded-lg">
          <div className="flex flex-col space-y-4">
            <a href="#warto" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
              Dlaczego warto
            </a>
            <a href="#przewaga" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
              Twoja przewaga
            </a>
            <a href="/allproducts" className="text-white hover:text-gray-300 transition-colors font-semibold font-inter">
              Zobacz kursy z programowania
            </a>
            <a
              href="#kurs"
              className="bg-[#D49C38] hover:bg-[#c69643] text-white font-semibold font-inter px-6 py-2 rounded-full text-center transition-colors"
            >
              Otwórz Kopalnię
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
