import { memo } from 'react'
import { MdOutlineGavel } from 'react-icons/md'
import { Link } from 'react-router-dom'

const LootRulesCard = memo(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div
      className='flex flex-col rounded-xl border border-border-color bg-surface-dark/60 p-6 backdrop-blur-md'
      id='rules'
    >
      <div className='flex items-center gap-3 mb-4'>
        <span
          className='material-symbols-outlined text-primary'
          style={{ fontSize: '28px' }}
        >
          <MdOutlineGavel />
        </span>
        <h3 className='text-xl font-bold text-white'>Loot Rules</h3>
      </div>
      <ul className='space-y-3 text-text-secondary list-disc pl-5'>
        <li>Se otorgan DKP por puntualidad a raid y por raid terminada.</li>
        <li>
          Los items se reparten mediante subasta. Gana quien haga la oferta más
          alta.
        </li>
        <li>Los nuevos reclutas reciben DKP de bienvenida.</li>
      </ul>

      <div className='flex justify-center'>
        <Link
          onClick={scrollToTop}
          to='/lootrules'
          className='px-4 py-1 text-center mt-9 text-[#a955f7] underline hover:text-purple-300'
        >
          Ver más
        </Link>
      </div>
    </div>
  )
})

LootRulesCard.displayName = 'LootRulesCard'

export default LootRulesCard
