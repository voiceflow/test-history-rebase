import { RichUtils } from 'draft-js';
import React from 'react';
import lifecycle from 'recompose/lifecycle';

import DraftJSEditor from '@/components/DraftJSEditor';
import { useEnableDisable, useForceUpdate, useTeardown } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import createPlugins, { PluginType } from './plugins';
import { fromState, toState } from './utils';

const DEFAULT_PLUGINS = [PluginType.VARIABLES];

function TextEditor({
  value = '',
  onBlur,
  onFocus,
  onEmpty,
  placeholder,
  onEnterPress,
  forwardedRef,
  pluginsTypes = DEFAULT_PLUGINS,
  pluginsProps,
  newLineOnEnter,
  onEditorStateChange,
}) {
  const initialState = React.useRef(value);
  const [readOnly, enableReadOnly, disableReadOnly] = useEnableDisable(false);
  const [forceUpdate, forceUpdateKey] = useForceUpdate();

  const {
    store,
    plugins,
    toTextAdapters,
    renderComponents,
    fromTextConvertor,

    ableToHandleBlur,
    ableToHandleReturn,
    recreateEditorState,
    forceBlurOnStateChange,
    resetRecreateEditorState,
    resetForceBlurOnStateChange,
  } = React.useMemo(() => createPlugins(pluginsTypes, pluginsProps, { enableReadOnly, disableReadOnly }, { textValue: value, isEmpty: !value }), []);

  const fromStateWithAdapter = React.useMemo(() => fromState(toTextAdapters), [toTextAdapters]);
  const [editorState, updateEditorState] = React.useState(() => toState(value, fromTextConvertor(pluginsProps)));

  store.merge({ readOnly, editorState, onEmpty, onBlur, onEnterPress, forceUpdate });

  const onHandlerReturn = React.useCallback(
    (e, nextEditorState) => {
      if (ableToHandleReturn()) {
        const onEnterPress = store.get('onEnterPress');

        if (onEnterPress) {
          const nextValue = fromStateWithAdapter(nextEditorState);

          store.set('textValue', nextValue.text);

          onEnterPress(nextValue);

          return 'handled';
        }

        if (newLineOnEnter) {
          updateEditorState(RichUtils.insertSoftNewline(nextEditorState));

          return 'handled';
        }
      }

      return null;
    },
    [ableToHandleReturn, fromStateWithAdapter, store, newLineOnEnter]
  );

  const onBlurEditor = React.useCallback(() => {
    const callback = store.get('onBlur');

    if (callback && ableToHandleBlur()) {
      const nextValue = fromStateWithAdapter(store.get('editorState'));

      store.set('textValue', nextValue.text);

      // eslint-disable-next-line callback-return
      callback(nextValue);
    }
  }, [ableToHandleBlur, fromStateWithAdapter, store]);

  const onEditorChange = React.useCallback(
    (newEditorState) => {
      updateEditorState(newEditorState);
      onEditorStateChange?.(newEditorState);

      store.set('editorState', newEditorState);

      if (forceBlurOnStateChange()) {
        onBlurEditor();
        resetForceBlurOnStateChange();
      }

      const isEmpty = !newEditorState.getCurrentContent().hasText();

      if (isEmpty !== store.get('isEmpty')) {
        store.get('onEmpty')?.(isEmpty);
        store.set('isEmpty', isEmpty);
      }
    },
    [forceBlurOnStateChange, onBlurEditor, resetForceBlurOnStateChange, store, onEditorStateChange]
  );

  const onEditorRef = React.useCallback(
    (editor) => {
      if (editor) {
        editor.forceUpdate = forceUpdate;
        editor.getCurrentValue = () => {
          const nextValue = fromStateWithAdapter(store.get('editorState'));

          store.set('textValue', nextValue.text);

          return nextValue;
        };
      }

      if (forwardedRef) {
        forwardedRef.current = editor;
      }
    },
    [forceUpdate, forwardedRef, fromStateWithAdapter, store]
  );

  store.set('onBlurEditor', onBlurEditor);

  const shouldRecreateEditorState = recreateEditorState();

  React.useEffect(() => {
    const cachedTextValue = store.get('textValue');

    if (value !== cachedTextValue || shouldRecreateEditorState) {
      const textValue = store.get('editorState') && cachedTextValue === value ? fromStateWithAdapter(store.get('editorState')).text : value;

      store.set('editorState', toState(textValue, fromTextConvertor(pluginsProps), store.get('editorState')));
      store.set('textValue', textValue);

      const isEmpty = !value;

      if (isEmpty !== store.get('isEmpty')) {
        store.get('onEmpty')?.(isEmpty);
        store.set('isEmpty', isEmpty);
      }

      updateEditorState(store.get('editorState'));

      resetRecreateEditorState();
    }
  }, [value, forceUpdateKey]);

  React.useEffect(() => {
    if (shouldRecreateEditorState) {
      forceUpdate();
    }
  }, [forceUpdate, shouldRecreateEditorState]);

  useTeardown(() => {
    if (store.get('textValue') !== initialState.current) {
      onBlurEditor();
    }
  }, [store]);

  return (
    <>
      <DraftJSEditor
        ref={onEditorRef}
        onBlur={onBlurEditor}
        onFocus={onFocus}
        plugins={plugins}
        onChange={onEditorChange}
        readOnly={readOnly}
        editorState={editorState}
        placeholder={placeholder}
        handleReturn={onHandlerReturn}
        stripPastedStyles
      />

      {renderComponents(pluginsProps)}
    </>
  );
}

const TextEditorWithCatch = lifecycle({
  componentDidCatch(err) {
    Sentry.error(err);
    this.forceUpdate();
  },
})(TextEditor);

export default React.forwardRef((props, ref) => <TextEditorWithCatch {...props} forwardedRef={ref} />);
