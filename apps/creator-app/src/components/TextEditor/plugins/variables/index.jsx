import createMentionPlugin from '@voiceflow/draft-js-mention-plugin';
import React from 'react';

import { Mutability, PluginType } from '../constants';
import Store from '../store';
import Portal from './components/Portal';
import Slot from './components/Slot';
import VariableSuggestion from './components/VariableSuggestion';
import { fromTextConvertor, toTextAdapter } from './utils';

const variablesPlugin = (globalStore, { characters = '' } = {}) => {
  const store = new Store();

  const plugin = createMentionPlugin({
    mentionRegExp: `[\\w${characters}]*`,
    mentionPrefix: '{',
    mentionSuffix: '}',
    mentionTrigger: '{',
    entityMutability: Mutability.IMMUTABLE,
    mentionComponent: Slot,
    supportWhitespace: true,
    mentionSuggestionsPortalComponent: Portal,
  });

  const defaultInitialize = plugin.initialize;

  plugin.initialize = (options, ...args) => {
    store.setEditorMethods(options.getEditorState, options.setEditorState);

    return defaultInitialize(options, ...args);
  };

  return {
    type: PluginType.VARIABLES,
    store,
    plugin,
    handlers: {
      onDelete: plugin.keyBindingFn,
      onReturn: plugin.handleReturn,
    },
    toTextAdapter: toTextAdapter(),

    renderComponent: (props) => (
      <VariableSuggestion
        {...props}
        key={PluginType.VARIABLES}
        store={store}
        globalStore={globalStore}
        MentionSuggestions={plugin.MentionSuggestions}
      />
    ),
    fromTextConvertor: fromTextConvertor(),
    fromPastedTextConvertor: fromTextConvertor(),
  };
};

export default variablesPlugin;
