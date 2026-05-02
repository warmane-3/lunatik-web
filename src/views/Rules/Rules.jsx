import { memo } from 'react'
import { 
  FaRegMoon, 
  FaCrown, 
  FaShieldAlt, 
  FaStar, 
  FaGem, 
  FaFire, 
  FaWaveSquare, 
  FaCloudMoon, 
  FaPlusCircle,
  FaExclamationTriangle,
  FaBan,
  FaDiscord,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa'
import './Rules.css'

const Rules = memo(() => {
  const ranks = [
    { 
      name: '👑 GM – LUNATIK', 
      desc: 'Máxima autoridad. Toma las decisiones finales y define la visión de la hermandad.',
      icon: <FaCrown />,
      color: '#a855f7' 
    },
    { 
      name: '⚔️ Oficiales – LUNATIKA y COSMIC', 
      desc: 'Autoridad total para decisiones, organización de raids y administración.',
      icon: <FaShieldAlt />,
      color: '#22d3ee' 
    },
    { 
      name: '🌟 ASTRAL MOON', 
      desc: 'Especialistas en su clase. Ayudan a otros miembros a mejorar su desempeño.',
      icon: <FaStar />,
      color: '#fcd34d' 
    },
    { 
      name: '✨ STELLAR', 
      desc: 'Jugadores élite, versátiles y confiables en la mayoría de las clases.',
      icon: <FaGem />,
      color: '#c084fc' 
    },
    { 
      name: '🔥 ETERNAL', 
      desc: 'Gran desempeño en raids, cumplimiento de mecánicas y alto rendimiento.',
      icon: <FaFire />,
      color: '#f87171' 
    },
    { 
      name: '🌌 MYSTIC', 
      desc: 'Desempeño decente en proceso de mejora y consolidación.',
      icon: <FaWaveSquare />,
      color: '#818cf8' 
    },
    { 
      name: '🌒 CRESCENT', 
      desc: 'Participando activamente en raids, en fase de aprendizaje y adaptación.',
      icon: <FaCloudMoon />,
      color: '#94a3b8' 
    },
    { 
      name: '🌑 NEW MOON', 
      desc: 'Miembros nuevos en proceso de integración y aprendizaje de normas.',
      icon: <FaPlusCircle />,
      color: '#64748b' 
    }
  ]

  return (
    <div className='Rules-container'>
      <div className='Rules-content'>
        {/* Hero Section */}
        <section className='rules-hero backdrop-blur-md'>
          <div className='flex justify-center mb-6'>
            <FaRegMoon size={60} className='text-primary animate-pulse' />
          </div>
          <h1>LUNATIK GUILD</h1>
          <p className='hero-text'>
            Bajo la luz de la luna nacieron los LUNATIK: guerreros que no temen al caos ni a la noche.
            Nuestra fuerza no viene solo del equipo o del daño… sino de la unión, la disciplina y el deseo de mejorar juntos.
          </p>
          <div className='hermandad-badge'>Hermandad • Horda • Warmane</div>
        </section>

        {/* Estructura de Rangos */}
        <section className='rules-section'>
          <h2 className='section-title'><FaCrown className='inline mr-2' /> Estructura de Rangos</h2>
          <div className='ranks-grid'>
            {ranks.map((rank, i) => (
              <div key={i} className='rank-card backdrop-blur-sm' style={{ borderLeft: `4px solid ${rank.color}` }}>
                <div className='rank-header' style={{ color: rank.color }}>
                  <span className='rank-icon'>{rank.icon}</span>
                  <h3>{rank.name}</h3>
                </div>
                <p>{rank.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Convivencia y Discord */}
        <div className='rules-grid-two'>
          <section className='rules-section'>
            <h2 className='section-title'><FaExclamationTriangle className='inline mr-2' /> Convivencia</h2>
            <div className='behavior-rules backdrop-blur-sm'>
              <div className='rule-item'>
                <FaBan className='text-red-500' />
                <span>No se tolera el comportamiento tóxico ni insultos.</span>
              </div>
              <div className='rule-item'>
                <FaBan className='text-red-500' />
                <span>No se toleran faltas contra oficiales.</span>
              </div>
              <p className='mt-4 text-sm text-text-secondary'>
                Si algo te molesta, comunícalo directamente con <strong>LUNATIK, LUNATIKA o COSMIC</strong>.
                Ambiente negativo conlleva a replace o expulsión.
              </p>
            </div>
          </section>

          <section className='rules-section'>
            <h2 className='section-title'><FaDiscord className='inline mr-2' /> Discord</h2>
            <div className='discord-rules backdrop-blur-sm'>
              <p className='mb-4'>Cada canal tiene su función. Úsalos para aprender y mejorar.</p>
              <div className='channels-tags'>
                <span>#general</span>
                <span>#anuncios</span>
                <span>#guías</span>
                <span>#weakauras</span>
              </div>
              <div className='rule-item mt-4 opacity-70'>
                <FaBan />
                <span>Prohibido Spam, Flood y discusiones personales.</span>
              </div>
            </div>
          </section>
        </div>

        {/* Visión */}
        <section className='rules-section mb-20'>
          <h2 className='section-title'><FaStar className='inline mr-2' /> Visión y Compromiso</h2>
          <div className='vision-container backdrop-blur-sm'>
            <p className='mb-6'>Nuestro objetivo: Raids eficientes de menos de 3 horas.</p>
            <div className='vision-grid'>
              <div className='vision-item'>
                <FaClock className='text-accent-cyan mb-2' size={24} />
                <h4>Puntualidad</h4>
                <p>Estar listo al inicio del call.</p>
              </div>
              <div className='vision-item'>
                <FaGem className='text-accent-cyan mb-2' size={24} />
                <h4>Preparación</h4>
                <p>Gemas, encantos y consumibles listos.</p>
              </div>
              <div className='vision-item'>
                <FaCheckCircle className='text-accent-cyan mb-2' size={24} />
                <h4>Compromiso</h4>
                <p>Atento a calls y evitar AFK.</p>
              </div>
            </div>
            <div className='footer-quote'>
              "Bajo la luna… todos somos LUNATIK." 🌙
            </div>
          </div>
        </section>
      </div>
    </div>
  )
})

Rules.displayName = 'Rules'

export default Rules
