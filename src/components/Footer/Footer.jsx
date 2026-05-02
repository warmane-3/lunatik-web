import { memo } from 'react'
import { GiGrimReaper } from 'react-icons/gi'

const Footer = memo(() => {
  return (
    <footer className='w-full border-t border-white/10 bg-background-dark py-6 px-4 sm:px-10'>
      <div className='flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left w-full max-w-7xl mx-auto'>
        <p className='text-sm text-white/60'>
          © 2024 &lt;Lunatik&gt; Guild. All rights reserved.
        </p>
        <a className='text-sm text-white underline flex' target='_blank' href='https://marteldev.com/'>
          <GiGrimReaper size={20} /> By Terry <GiGrimReaper size={20} />
        </a>
        <div className='flex items-center gap-4'>
          <a
            href='https://armory.warmane.com/guild/Lunatik/Icecrown/summary'
            className='text-sm text-white/60 hover:text-white transition-colors'
            target='_blank'
          >
            Warcraft Logs
          </a>
          <a
            href='https://armory.warmane.com/guild/Lunatik/Icecrown/summary'
            className='text-sm text-white/60 hover:text-white transition-colors'
            target='_blank'
          >
            Wowhead
          </a>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
