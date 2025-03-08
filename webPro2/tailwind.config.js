/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)', // Custom easing
      },
      transitionDuration: {
        '300': '300ms', // Custom duration
      },
      fontSize: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '10px': '10px',
        '20px': '20px',
        '30px': '30px',
        '40px': '40px',
        '50px': '50px',
        '60px': '60px',
        '70px': '70px',
        '80px': '80px',
        '90px': '90px',
        '100px': '100px',
        '110px': '110px',
        '120px': '120px',
      },
    },
  },
  plugins: [],
}
