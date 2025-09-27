// docusaurus.config.js
module.exports = {
  title: 'Tech Tutorials',
  tagline: 'Learn Cloud, AI, and DevOps step by step',
  url: 'https://your-username.github.io',
  baseUrl: '/tutorials-site/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'your-username', // GitHub username
  projectName: 'tutorials-site',     // Repo name

  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: require.resolve('./sidebars.js') },
        blog: { showReadingTime: true },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],
};
