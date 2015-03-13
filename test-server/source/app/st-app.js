import { App } from './app';
import Modules from './st-modules';


export default {
  component: App,
  routes: {
    '/': {
      name: 'Home',
      title: 'Meepworks'
    },
    '/modules': {
      name: 'Modules',
      app: Modules,
      title: 'Modules'
    }
  }
};
