/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0eeff',
          100: '#e4e0ff',
          200: '#ccc6ff',
          300: '#a99fff',
          400: '#8470ff',
          500: '#6c63ff',
          600: '#5a4fe6',
          700: '#4b3fcc',
          800: '#3d34a6',
          900: '#342d85',
        },
      },
      backgroundImage: {
        'grad-btn': 'linear-gradient(90deg, #6c63ff 0%, #3b82f6 100%)',
        'grad-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)',
      },
      boxShadow: {
        card: '0 4px 24px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 40px rgba(15, 23, 42, 0.14)',
        modal: '0 25px 60px rgba(15, 23, 42, 0.20)',
      },
      borderRadius: {
        xl2: '25px',
      },
    },
  },
  plugins: [],
}
