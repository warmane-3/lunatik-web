import { GiHamburgerMenu } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaRegMoon } from "react-icons/fa6"

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='fixed top-0 z-50 flex w-full items-center justify-center border-b border-white/10 bg-background-dark/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80 sm:px-10'>
      <div className='flex w-full max-w-7xl items-center justify-between'>
        {/* Logo and Guild Name */}
        <Link to={'/'} className='flex items-center gap-2 text-white'>
          <div className='size-6'>
            <FaRegMoon size={24} color='#a855f7' />
          </div>
          <h2 className='text-lg font-bold leading-tight tracking-[-0.015em] text-[#a855f7]'>
            Lunatik
          </h2>
        </Link>

        {/* Desktop Navigation Links */}
        <div className='hidden items-center gap-9 md:flex'>
          <Link
            to='/'
            className='text-sm font-medium leading-normal text-white/80 hover:text-white'
          >
            HOME
          </Link>
          
          <Link
            to='/loottable'
            className='text-sm font-medium leading-normal text-white/80 hover:text-white'
          >
            LOOT LIST
          </Link>
          <Link
            to='/lootrules'
            className='text-sm font-medium leading-normal text-white/80 hover:text-white'
          >
            SISTEMA DKP
          </Link>
          <Link
            to='/rules'
            className='text-sm font-medium leading-normal text-white/80 hover:text-white'
          >
            RANGOS Y REGLAS
          </Link>
        </div>

        {/* Right side: Login + Hamburger */}
        <div className='flex items-center gap-2'>
          <Link
            to='/login'
            className='flex min-w-21 max-w-120 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover transition-colors'
            rel='noopener noreferrer'
          >
            <span className='truncate'>Login</span>
          </Link>

          {/* Hamburger button (visible only on mobile) */}
          <button
            onClick={toggleMenu}
            className='flex size-10 items-center justify-center rounded-lg text-white/80 hover:text-white md:hidden'
            aria-label='Toggle menu'
          >
            <GiHamburgerMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className='absolute left-0 top-full w-full bg-black/90 backdrop-blur-3xl border-b border-white/10 py-4 px-4 shadow-lg md:hidden'>
          <div className='flex flex-col space-y-3'>
            <Link
              to='/'
              onClick={closeMenu}
              className='text-sm font-medium leading-normal text-white/80 hover:text-white py-2'
            >
              HOME
            </Link>
            <Link
              to='/rules'
              onClick={closeMenu}
              className='text-sm font-medium leading-normal text-white/80 hover:text-white py-2'
            >
              REGLAS
            </Link>
            <Link
              to='/loottable'
              onClick={closeMenu}
              className='text-sm font-medium leading-normal text-white/80 hover:text-white py-2'
            >
              LOOT
            </Link>
            <Link
              to='/lootrules'
              onClick={closeMenu}
              className='text-sm font-medium leading-normal text-white/80 hover:text-white py-2'
            >
              SISTEMA DKP
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
