/* eslint-disable no-shadow */
import base from './base';
import { PluginType } from './constants';
import Store from './store';
import { createPluginsHandlers, createTextConvertorsChain } from './utils';
import variables from './variables';
import xml from './xml';

export * from './constants';

const PLUGINS_MAP = {
  [PluginType.VARIABLES]: variables,
  [PluginType.XML]: xml,
};

const createPlugins = (
  pluginsTypes,
  pluginsProps,
  { readOnly, enableReadOnly, disableReadOnly },
  initialStore = {}
) => {
  const store = new Store({ ...initialStore, pluginsProps, readOnly, enableReadOnly, disableReadOnly });

  const pluginsInstances = pluginsTypes.map((type) => PLUGINS_MAP[type](store, pluginsProps[type]));

  const handlers = createPluginsHandlers(pluginsInstances);
  const toTextAdapters = pluginsInstances.reduce(
    (obj, { type, toTextAdapter }) => Object.assign(obj, { [type]: toTextAdapter }),
    {}
  );
  const fromTextConvertor = createTextConvertorsChain(
    ...pluginsInstances.map(({ type, fromTextConvertor }) => ({ type, convertor: fromTextConvertor }))
  );
  const fromPastedTextConvertor = createTextConvertorsChain(
    ...pluginsInstances.map(({ type, fromPastedTextConvertor }) => ({ type, convertor: fromPastedTextConvertor }))
  );

  const baseInstance = base(store, { handlers, fromPastedTextConvertor }, pluginsProps[PluginType.BASE]);

  return {
    store,
    plugins: [baseInstance.plugin, ...pluginsInstances.map(({ plugin }) => plugin)],
    toTextAdapters,
    fromTextConvertor,

    renderComponents: (pluginsProps) => {
      store.set('pluginsProps', pluginsProps);

      return pluginsInstances.map(({ type, renderComponent }) =>
        renderComponent ? renderComponent(pluginsProps[type]) : null
      );
    },

    ableToHandleBlur: () => pluginsInstances.every(({ store }) => store.get('ableToHandleBlur') !== false),
    ableToHandleReturn: () => pluginsInstances.every(({ store }) => store.get('ableToHandleReturn') !== false),
    recreateEditorState: () => pluginsInstances.some(({ store }) => store.get('recreateEditorState') === true),
    forceBlurOnStateChange: () => pluginsInstances.some(({ store }) => store.get('forceBlurOnStateChange') === true),
    resetRecreateEditorState: () => pluginsInstances.some(({ store }) => store.set('recreateEditorState', false)),
    resetForceBlurOnStateChange: () => pluginsInstances.some(({ store }) => store.set('forceBlurOnStateChange', false)),
  };
};

export default createPlugins;
