import { memo } from 'react'
import {
  FaCoins,
  FaShieldAlt,
  FaPlusCircle,
  FaCheckCircle,
  FaUserShield,
  FaSkullCrossbones,
  FaLightbulb,
  FaInfoCircle,
  FaMedal,
  FaHandHoldingHeart
} from 'react-icons/fa'
import { GiSwordsEmblem, GiHealingShield } from 'react-icons/gi'
import './LootRules.css'

const LootRules = memo(() => {
  const baseGains = [
    { name: 'Assist / Asistencia', value: '+1000', color: '#22d3ee' },
    { name: 'Lich King 25H (LOD)', value: '+8000', color: '#a855f7' },
    { name: 'ICC 25 (8/12)', value: '+4000', color: '#c084fc' },
    { name: 'Ruby Sanctum 25HC', value: '+5000', color: '#22d3ee' },
    {
      name: 'Ruby Sanctum 25NM',
      value: '+1000',
      extra: '+500 extra raids',
      color: '#94a3b8'
    },
    { name: 'TOGC 25', value: '+6000', color: '#fcd34d' }
  ]

  const roleBonuses = [
    { role: 'Tanks', value: '+1000', icon: <FaShieldAlt />, color: '#3b82f6' },
    {
      role: 'Healers',
      value: '+1000',
      icon: <GiHealingShield />,
      color: '#10b981'
    },
    {
      role: 'Top DPS',
      value: '+1000',
      icon: <GiSwordsEmblem />,
      color: '#ef4444'
    }
  ]

  const specificBonuses = [
    { name: 'Top DPS Total Raid', value: '+200' },
    { name: 'Top Daño Oozes (PP)', value: '+200' },
    { name: 'Top Daño Fase 2 (Sindra)', value: '+200' },
    { name: 'Top Daño Valkyrs (LK)', value: '+200' },
    { name: 'Top Daño Útil (LK)', value: '+200' },
    { name: 'Uso de 12 Pociones', value: '+500' },
    { name: 'Puntualidad', value: '+500' },
    { name: 'Fixear Clase', value: '+500' }
  ]

  const penalties = [
    {
      name: 'Error Mínimo',
      value: '-500',
      desc: 'Mecánicas básicas, fallos leves.'
    },
    {
      name: 'Error Grande',
      value: '-1000',
      desc: 'No seguir calls, AFK sin aviso.'
    },
    {
      name: 'Error Repetitivo',
      value: '-2000',
      desc: 'Wipes por culpa personal, reincidencia.'
    }
  ]

  return (
    <div className='LootRules-container'>
      <div className='LootRules-content'>
        {/* Header Section */}
        <section className='lootr-header backdrop-blur-md'>
          <div className='flex justify-center mb-4'>
            <FaCoins size={50} className='text-[#fcd34d] animate-bounce' />
          </div>
          <h1>SISTEMA DKP</h1>
          <p className='subtitle'>
            Reglamento oficial de distribución de botín y méritos de la
            hermandad LUNATIK.
          </p>
          <div className='raid-badges'>
            <span>ICC 25 NM/HC</span>
            <span>RS 25 NM/HC</span>
            <span>TOGC 25</span>
          </div>
          <div className='dkp-cap mt-6'>
            <FaInfoCircle className='inline mr-2' />
            Cap Máximo:{' '}
            <span className='text-white font-bold'>500,000 DKP</span>
          </div>
        </section>

        {/* Gains Grid */}
        <div className='lootr-grid'>
          {/* Base DKP Section */}
          <section className='lootr-card backdrop-blur-sm'>
            <h2 className='card-title'>
              <FaCheckCircle className='text-green-400 mr-2' /> Ganancia Base
            </h2>
            <div className='gains-list'>
              {baseGains.map((gain, i) => (
                <div key={i} className='gain-item'>
                  <span className='gain-name'>{gain.name}</span>
                  <div className='gain-values'>
                    <span className='gain-val' style={{ color: gain.color }}>
                      {gain.value}
                    </span>
                    {gain.extra && (
                      <span className='gain-extra'>{gain.extra}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Role Bonus Section */}
          <section className='lootr-card backdrop-blur-sm'>
            <h2 className='card-title'>
              <FaMedal className='text-blue-400 mr-2' /> Bonos por Rol
            </h2>
            <div className='roles-grid'>
              {roleBonuses.map((role, i) => (
                <div
                  key={i}
                  className='role-card'
                  style={{ borderColor: role.color }}
                >
                  <div className='role-icon' style={{ color: role.color }}>
                    {role.icon}
                  </div>
                  <span className='role-name'>{role.role}</span>
                  <span className='role-val'>{role.value}</span>
                </div>
              ))}
            </div>
            <p className='text-xs text-text-muted mt-4 italic'>
              * Los bonos se suman después del DKP base.
            </p>
          </section>
        </div>

        {/* Penalties & Performance Section */}
        <div className='lootr-grid-three'>
          {/* Penalties */}
          <section className='lootr-card penalty-card backdrop-blur-sm'>
            <h2 className='card-title'>
              <FaSkullCrossbones className='text-red-500 mr-2' /> Penalizaciones
            </h2>
            <div className='penalty-list'>
              {penalties.map((p, i) => (
                <div key={i} className='penalty-item'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='penalty-name'>{p.name}</span>
                    <span className='penalty-val'>{p.value}</span>
                  </div>
                  <p className='penalty-desc'>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Bonuses */}
          <section className='lootr-card performance-card backdrop-blur-sm'>
            <h2 className='card-title'>
              <FaPlusCircle className='text-accent-cyan mr-2' /> Rendimiento
            </h2>
            <div className='perf-list'>
              {specificBonuses.map((b, i) => (
                <div key={i} className='perf-item'>
                  <span>{b.name}</span>
                  <span className='text-accent-cyan font-bold'>{b.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Important Rules */}
          <section className='lootr-card rules-summary-card backdrop-blur-sm'>
            <h2 className='card-title'>
              <FaUserShield className='text-primary mr-2' /> Administración
            </h2>
            <ul className='rules-summary-list'>
              <li>
                <FaInfoCircle className='inline mr-2 text-primary' />
                DKP personal e intransferible.
              </li>
              <li>
                <FaUserShield className='inline mr-2 text-primary' />
                Evaluado por GM y Oficiales.
              </li>
              <li>
                <FaLightbulb className='inline mr-2 text-primary' />
                Discusiones en privado, no canales públicos.
              </li>
              <li>
                <FaHandHoldingHeart className='inline mr-2 text-primary' />
                Se premia asistencia y rendimiento real.
              </li>
            </ul>
            <div className='mt-8 pt-4 border-t border-white/10 text-center'>
              <p className='text-primary font-cinzel italic'>
                {`"Porque bajo la luna… todos somos LUNATIK."`}
`              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
})

LootRules.displayName = 'LootRules'

export default LootRules
