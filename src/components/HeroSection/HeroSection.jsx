import { memo, useCallback } from 'react'
import woodsVideo from '../../assets/woods.webm'

const HeroSection = memo(() => {
  const handleScrollToTable = useCallback(() => {
    const element = document.getElementById('dkp')
    if (element) {
      const yOffset = -80
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className='mb-8 @container'>
      <div
        className='relative overflow-hidden @container'
        style={{
          backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%)`
        }}
      >
        <video
          src={woodsVideo}
          autoPlay
          loop
          muted
          playsInline
          className='absolute inset-0 w-full h-full object-cover z-0'
        />
        <div className='relative z-10 flex min-h-100 flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 border border-white/5'>
          <div className='flex flex-col gap-2 text-center'>
            <h1 className='text-4xl font-black leading-tight tracking-[-0.033em] text-white @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]'>
              Bienvenido a Lunatik
            </h1>
            <h2 className='text-sm font-normal leading-normal text-white/80 @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal'>
              Conquistadores de la Ciudadela de la Corona de Hielo. ¡Por la
              Horda! - Servidor Warmane
            </h2>
          </div>
          <button
            onClick={handleScrollToTable}
            className='flex min-w-[120px] max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary-hover transition-all shadow-lg active:scale-95 border border-white/50'
          >
            <span className='truncate'>Ver lista de DKP</span>
          </button>
        </div>
      </div>
    </div>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
