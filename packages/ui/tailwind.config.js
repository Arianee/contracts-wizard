module.exports = {
  content: [
    './src/**/*.{html,svelte}',

    // Using glob patterns results in infinite loop
    './public/index.html',
    './public/embed.html',
  ],
};
