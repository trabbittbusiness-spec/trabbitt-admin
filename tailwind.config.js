module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BFA5',
        'primary-dark': '#00A08A',
        surface: '#1A1A2E',
        'surface-2': '#16213E',
        'surface-3': '#0F3460',
        accent: '#E94560',
        sidebar: '#0D0D1A',
        'sidebar-active': '#1A1A2E',
        border: 'rgba(255,255,255,0.08)',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255,255,255,0.55)',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
    },
  },
  plugins: [],
};
