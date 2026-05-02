/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Guild Branding (Lunatik Space)
        primary: '#A855F7',
        'primary-hover': '#9333EA',

        // Backgrounds
        'background-light': '#f6f6f8',
        'background-dark': '#020617',
        'background-darker': '#010409',
        'surface-dark': '#0F172A',
        'surface-darker': '#1E293B',

        // Class Colors (WoW)
        'class-dk': '#C41F3B',
        'class-druid': '#FF7D0A',
        'class-hunter': '#ABD473',
        'class-mage': '#3FC7EB',
        'class-paladin': '#F48CBA',
        'class-priest': '#FFFFFF',
        'class-rogue': '#FFF569',
        'class-shaman': '#0070DE',
        'class-warlock': '#8787ED',
        'class-warrior': '#C79C6E',

        // UI Colors
        'accent-cyan': '#22D3EE',
        'accent-cyan-light': '#67E8F9',
        'border-color': '#334155',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B'
      },
      fontFamily: {
        display: ['Spline Sans', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem'
      },
      backgroundColor: {
        'elf-bg': "url('/src/assets/bg-elf.png')"
      },
      backdropBlur: {
        sm: '2px'
      }
    }
  },
  plugins: []
}
