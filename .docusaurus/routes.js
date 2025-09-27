import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
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
