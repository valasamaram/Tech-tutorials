import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/Tech-tutorials/__docusaurus/debug',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug', '6f8'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/config',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/config', '946'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/content',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/content', '97b'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/globalData',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/globalData', '6be'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/metadata',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/metadata', '744'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/registry',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/registry', 'd10'),
    exact: true
  },
  {
    path: '/Tech-tutorials/__docusaurus/debug/routes',
    component: ComponentCreator('/Tech-tutorials/__docusaurus/debug/routes', '2db'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog',
    component: ComponentCreator('/Tech-tutorials/blog', '65b'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/2025/01/01/welcome',
    component: ComponentCreator('/Tech-tutorials/blog/2025/01/01/welcome', '325'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/archive',
    component: ComponentCreator('/Tech-tutorials/blog/archive', '837'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/authors',
    component: ComponentCreator('/Tech-tutorials/blog/authors', '563'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/tags',
    component: ComponentCreator('/Tech-tutorials/blog/tags', '643'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/tags/introduction',
    component: ComponentCreator('/Tech-tutorials/blog/tags/introduction', '739'),
    exact: true
  },
  {
    path: '/Tech-tutorials/blog/tags/welcome',
    component: ComponentCreator('/Tech-tutorials/blog/tags/welcome', '171'),
    exact: true
  },
  {
    path: '/Tech-tutorials/docs',
    component: ComponentCreator('/Tech-tutorials/docs', 'f38'),
    routes: [
      {
        path: '/Tech-tutorials/docs',
        component: ComponentCreator('/Tech-tutorials/docs', '18c'),
        routes: [
          {
            path: '/Tech-tutorials/docs',
            component: ComponentCreator('/Tech-tutorials/docs', '910'),
            routes: [
              {
                path: '/Tech-tutorials/docs/cloud/azure',
                component: ComponentCreator('/Tech-tutorials/docs/cloud/azure', 'bac'),
                exact: true,
                sidebar: "sidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/Tech-tutorials/',
    component: ComponentCreator('/Tech-tutorials/', 'e70'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
