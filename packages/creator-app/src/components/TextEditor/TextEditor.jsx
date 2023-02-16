import { datadogRum } from '@datadog/browser-rum';
import { setRef, useDidUpdateEffect, useEnableDisable, useForceUpdate, useTeardown } from '@voiceflow/ui';
import { EditorState, RichUtils } from 'draft-js';
import React from 'react';
import lifecycle from 'recompose/lifecycle';

import DraftJSEditor from '@/components/DraftJSEditor';

import createPlugins, { PluginType } from './plugins';
import { fromState, toState } from './utils';

const DEFAULT_PLUGINS = [PluginType.VARIABLES];

function TextEditor({
  value = '',
  onBlur,
  onFocus,
  onEmpty,
  readOnly: propReadOnly,
  placeholder,
  onEnterPress,
  forwardedRef,
  pluginsTypes = DEFAULT_PLUGINS,
  pluginsProps,
  newLineOnEnter,
  skipBlurOnUnmount,
  onEditorStateChange,
  newLineOnShiftEnter,
}) {
  const initialState = React.useRef(value);
  const [readOnly, enableReadOnly, disableReadOnly] = useEnableDisable(!!propReadOnly);
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

        if (newLineOnEnter || (newLineOnShiftEnter && e.shiftKey)) {
          updateEditorState(RichUtils.insertSoftNewline(nextEditorState));

          return 'handled';
        }
      }

      return null;
    },
    [ableToHandleReturn, fromStateWithAdapter, store, newLineOnEnter, newLineOnShiftEnter]
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

      if (store.get('onEmpty')) {
        const isEmpty = newEditorState.getCurrentContent().blockMap.every((content) => !content.getText().trim());

        if (isEmpty !== store.get('isEmpty')) {
          store.get('onEmpty')?.(isEmpty);
          store.set('isEmpty', isEmpty);
        }
      }
    },
    [forceBlurOnStateChange, onBlurEditor, resetForceBlurOnStateChange, store, onEditorStateChange]
  );

  const onEditorRef = React.useCallback(
    (editor) => {
      if (editor) {
        Object.assign(editor, {
          forceUpdate,

          clear: () => {
            const newState = EditorState.createEmpty();
            const nextValue = fromStateWithAdapter(newState);

            store.set('textValue', nextValue.text);
            store.set('editorState', newState);

            updateEditorState(newState);
          },

          select: () => {
            const currentContent = editorState.getCurrentContent();
            const selection = editorState.getSelection().merge({
              anchorKey: currentContent.getFirstBlock().getKey(),
              anchorOffset: 0,

              focusOffset: currentContent.getLastBlock().getText().length,
              focusKey: currentContent.getLastBlock().getKey(),
            });

            updateEditorState(EditorState.forceSelection(editorState, selection));
          },

          getCurrentValue: () => {
            const nextValue = fromStateWithAdapter(store.get('editorState'));

            store.set('textValue', nextValue.text);

            return nextValue;
          },

          forceFocusToTheEnd: () => {
            const newState = EditorState.moveFocusToEnd(EditorState.moveSelectionToEnd(store.get('editorState')));

            updateEditorState(newState);
          },
        });
      }

      setRef(forwardedRef, editor);
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

  useDidUpdateEffect(() => {
    if (propReadOnly) {
      enableReadOnly();
    } else {
      disableReadOnly();
    }
  }, [propReadOnly]);

  useTeardown(() => {
    if (!skipBlurOnUnmount && store.get('textValue') !== initialState.current) {
      onBlurEditor();
    }
  }, [store, skipBlurOnUnmount]);

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
    datadogRum.addError(err);
    this.forceUpdate();
  },
})(TextEditor);

export default React.forwardRef((props, ref) => <TextEditorWithCatch {...props} forwardedRef={ref} />);
