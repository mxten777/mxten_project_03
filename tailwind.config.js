/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#60a5fa',   // blue-400
          dark: '#1e40af',    // blue-800
        },
        secondary: {
          DEFAULT: '#64748b', // slate-500
          light: '#cbd5e1',   // slate-200
          dark: '#334155',    // slate-800
        },
        accent: {
          DEFAULT: '#f59e42', // orange-400
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

