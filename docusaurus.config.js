module.exports = {
  title: 'Tech Tutorials',
  tagline: 'Learn Cloud, AI, and DevOps step by step',
  url: 'https://valasamaram.github.io',  // GitHub username
  baseUrl: '/Tech-tutorials/',                  // Repository name
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'valasamaram',       // GitHub username
  projectName: 'Tech-tutorials',                // Repository name

  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: require.resolve('./sidebars.js') },
        blog: { showReadingTime: true },
        theme: {  },
      },
    ],
  ],
};
