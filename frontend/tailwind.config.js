/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ //tells Tailwind which locations to look for any classes!(we would prolly only use classes within src parent directory so we define that here.)
    "./src/**/*.{js, jsx, ts, tsx}",
    // **/* means "any folder, any depth" inside src/
    // *.{js,jsx,ts,tsx} means "any file with these extensions"
    // So it scans every JS/JSX file in your src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

