import { useCache, useSetup } from '@voiceflow/ui';
import React from 'react';
import { Descendant, Editor } from 'slate';
import { Editable, Slate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

import { useForceUpdate } from '@/hooks';

import { EditorContextProvider, PluginsOptionsContextProvider, StaticEditorContextProvider } from './contexts';
import { DEFAULT_PLUGINS_OPTIONS, EditorAPI, PluginsOptions } from './editor';
import { useEditorDecorate, useEditorHotkeys } from './hooks';
import { defaultRenderElement, defaultRenderLeaf, defaultRenderPlaceholder } from './renderers';

export * from './components';
export { ControlledEditorProvider, useSlateEditor, useSlateEditorContext, useStaticSlateEditor } from './contexts';
export type { PluginsOptions as SlatePluginsOptions, VariableItem as SlateVariableItem } from './editor';
export { EditorAPI as SlateEditorAPI, PluginType as SlatePluginType } from './editor';
export { useSetupEditor as useSetupSlateEditor, useEditorForceNormalize as useSlateEditorForceNormalize } from './hooks';

export type SlateValue = Descendant[];

export interface SlateEditableRef {
  focus: () => void;
}

export interface SlateEditableProps extends Omit<EditableProps, 'value' | 'onChange' | 'decorate'> {
  value: SlateValue;
  editor: Editor;
  onChange: (value: SlateValue) => void;
  autofocus?: boolean;
  spellCheck?: boolean;
  topToolbar?: React.ReactNode;
  pluginsOptions?: PluginsOptions;
}

const SlateEditable: React.ForwardRefRenderFunction<SlateEditableRef, SlateEditableProps> = (
  {
    value,
    onBlur,
    editor,
    onChange,
    children,
    autofocus,
    topToolbar,
    spellCheck = false,
    renderLeaf = defaultRenderLeaf,
    renderElement = defaultRenderElement,
    pluginsOptions = DEFAULT_PLUGINS_OPTIONS,
    renderPlaceholder = defaultRenderPlaceholder,
    ...editableProps
  },
  ref
) => {
  const [forceUpdate, contextKey] = useForceUpdate();

  const cache = useCache({ onBlur, onChange });
  const decorate = useEditorDecorate(editor);
  const onKeyDown = useEditorHotkeys(editor, editableProps.onKeyDown);

  const editorContext = React.useMemo<[Editor]>(() => [editor], [contextKey]);

  const onLocalChange = React.useCallback((value: Descendant[]) => {
    cache.current.onChange(value);
    forceUpdate();
  }, []);

  const onLocalBlur = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!editor.blurPrevented) {
      cache.current.onBlur?.(event);
    }
  }, []);

  editor.pluginsOptions = pluginsOptions;

  React.useImperativeHandle(ref, () => ({ focus: () => EditorAPI.focus(editor) }), [editor]);

  useSetup(() => {
    if (autofocus) {
      EditorAPI.focus(editor);
      const currentRangeFocus = EditorAPI.fullRange(editor).focus;
      EditorAPI.setSelection(editor, { anchor: currentRangeFocus, focus: currentRangeFocus });
    }
  });

  return (
    <StaticEditorContextProvider value={editor}>
      <EditorContextProvider value={editorContext}>
        <PluginsOptionsContextProvider value={pluginsOptions}>
          {topToolbar}

          <Slate editor={editor} value={value} onChange={onLocalChange}>
            <Editable
              onBlur={onLocalBlur}
              decorate={decorate ?? undefined}
              renderLeaf={renderLeaf}
              spellCheck={spellCheck}
              renderElement={renderElement}
              renderPlaceholder={renderPlaceholder}
              {...editableProps}
              onKeyDown={onKeyDown}
            />
          </Slate>

          {children}
        </PluginsOptionsContextProvider>
      </EditorContextProvider>
    </StaticEditorContextProvider>
  );
};

export default React.forwardRef<SlateEditableRef, SlateEditableProps>(SlateEditable);
