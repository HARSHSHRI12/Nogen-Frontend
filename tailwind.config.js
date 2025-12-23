/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'background': 'var(--background-color)',
        'text-color': 'var(--text-color)',
        'light-color': 'var(--light-color)',
        'dark-color': 'var(--dark-color)',
      },
    },
  },
  plugins: [],
}
