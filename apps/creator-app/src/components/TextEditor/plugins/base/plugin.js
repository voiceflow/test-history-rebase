import { KeyName } from '@voiceflow/ui';

import { deleteHandler, pasteTextHandler } from './utils';

export default (globalStore, store, { handlers, fromPastedTextConvertor }) => {
  const wrapHandler = (handlerName, handler) => (e) => {
    const { state, editorState, ...options } = handler(store)(e);

    handlers[handlerName]?.(e, { editorState, ...options });

    return state;
  };

  const defaultHandler = () => () => ({ state: 'handled', editorState: store.getEditorState() });

  const onDelete = wrapHandler('onDelete', deleteHandler);
  const onReturn = wrapHandler('onReturn', defaultHandler);
  const onPasteText = wrapHandler('onPasteText', pasteTextHandler(globalStore, fromPastedTextConvertor));

  return {
    decorators: [],

    initialize: ({ getEditorState, setEditorState }) => {
      store.setEditorMethods(getEditorState, setEditorState);
    },

    handleReturn: onReturn,

    handlePastedText: onPasteText,

    // eslint-disable-next-line consistent-return
    keyBindingFn: (e) => {
      // delete
      if (e.key === KeyName.DELETE || e.key === KeyName.BACKSPACE) {
        return onDelete(e);
      }
    },
  };
};
