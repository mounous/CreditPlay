import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreditStartForm.vue') },
      { path: '/help', component: () => import('pages/CreditHelpPage.vue') },
      {
        path: '/events',
        component: () => import('pages/CreditEventsHandler.vue'),
      },
      { path: '/summary', component: () => import('pages/SummaryPage.vue') },
      { path: '/lineChart', component: () => import('pages/lineChartPage.vue') },
      { path: '/bank', component: () => import('pages/bankPage.vue') },
      { path: '/memory', component: () => import('pages/memoryPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
