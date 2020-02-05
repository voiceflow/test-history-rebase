import React from 'react';

import { CloseTag, FakeSelection, OpenTag } from './components';
import { changeHandler, findFakeSelectionStrategy, findOpenCloseStrategy, findOpenTagStrategy } from './utils';

export default (globalStore, store, { tags }) => {
  const DecoratedOpenTag = (props) => <OpenTag {...props} store={store} tags={tags} globalStore={globalStore} />;
  const DecoratedCloseTag = (props) => <CloseTag {...props} store={store} tags={tags} globalStore={globalStore} />;
  const DecoratedFakeSelection = (props) => <FakeSelection {...props} store={store} globalStore={globalStore} />;

  return {
    decorators: [
      {
        strategy: findOpenTagStrategy(),
        component: DecoratedOpenTag,
      },
      {
        strategy: findOpenCloseStrategy(),
        component: DecoratedCloseTag,
      },
      {
        strategy: findFakeSelectionStrategy(),
        component: DecoratedFakeSelection,
      },
    ],

    initialize: ({ getEditorState, setEditorState }) => {
      store.setEditorMethods(getEditorState, setEditorState);
    },

    onChange: changeHandler(store),
  };
};
