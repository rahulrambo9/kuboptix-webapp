/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // The connector we fixed earlier
    'autoprefixer': {},         // The tool we just installed
  },
};

export default config;