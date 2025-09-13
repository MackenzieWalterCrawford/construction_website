/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nyc-blue': '#0066cc',
        'construction-orange': '#ff6b35',
      },
      height: {
        'screen-minus-header': 'calc(100vh - 4rem)',
      },
    },
  },
  plugins: [],
}