import Store from '../store';
import base from './plugin';

const basePlugin = (globalStore, { handlers, fromPastedTextConvertor }) => {
  const store = new Store();

  const plugin = base(globalStore, store, { handlers, fromPastedTextConvertor });

  return {
    type: 'base',
    store,
    plugin,
  };
};

export default basePlugin;
