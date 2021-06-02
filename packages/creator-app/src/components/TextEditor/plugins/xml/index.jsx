import React from 'react';

import { PluginType } from '../constants';
import { Controls } from './components';
import xml from './plugin';
import Store from './store';
import { fromTextConvertor, toTextAdapter } from './utils';

const xmlPlugin = (globalStore, options) => {
  const store = new Store(options.type);

  const plugin = xml(globalStore, store, options);

  return {
    type: PluginType.XML,
    store,
    plugin,
    handlers: {},
    toTextAdapter: toTextAdapter(),
    // eslint-disable-next-line react/display-name
    renderComponent: (props) => <Controls {...props} key={PluginType.XML} store={store} globalStore={globalStore} />,
    fromTextConvertor: fromTextConvertor(),
    fromPastedTextConvertor: fromTextConvertor(),
  };
};

export default xmlPlugin;
