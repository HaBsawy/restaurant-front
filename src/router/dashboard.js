import CategoryView from '@/views/dashboard/CategoryView.vue';
import ProductView from '@/views/dashboard/ProductView.vue';
import ShowProductView from '@/views/dashboard/ShowProductView.vue';
import ShowCategoryView from '@/views/dashboard/ShowCategoryView.vue';

export default [
  {
    path: 'categories',
    name: 'categories',
    component: CategoryView,
  },
  {
    path: 'products',
    name: 'products',
    component: ProductView,
  },
  {
    path: 'products/:id',
    name: 'showProduct',
    component: ShowProductView,
  },
  {
    path: 'categories/:id',
    name: 'showCategory',
    component: ShowCategoryView,
  },
];
