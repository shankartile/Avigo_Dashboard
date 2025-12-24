// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '1.5xl': '1596px',   // custom
      '1.7xl': '1715px',   // custom
      '1.75xl': '1760px',  // custom
      '2xl': '1536px',
    },
    extend: {
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideDown: 'slideDown 1s ease-out',
      },
    },
  },
  plugins: [],
};
