import { TimeStore, Modules } from './modules';
import NestedApp1 from './nested/st-nest1';
export default {
  component: Modules,
  stores: [TimeStore],
  routes: {
    '/modules/nest1': {
      app: NestedApp1,
      title: 'Nest App 1',
      name: 'nest1'
    }
  }
};
