import { defineConfig } from '@umijs/max';
import routes from './routes';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField:'',
  },
  layout: {
    // title: 'wusi|个人博客',
  },
  routes:routes,
  npmClient: 'yarn',
});

