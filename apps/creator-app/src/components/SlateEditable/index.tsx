import { BaseText } from '@voiceflow/base-types';
import { serializeToJSX } from '@voiceflow/slate-serializer/jsx';
import { useCache, useForceUpdate, useSetup } from '@voiceflow/ui';
import React from 'react';
import { Descendant, Editor } from 'slate';
import { Editable, Slate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

import { getValidHref } from '@/utils/string';

import * as components from './components';
import {
  ControlledEditorProvider,
  EditorContextProvider,
  PluginsOptionsContextProvider,
  StaticEditorContextProvider,
  useSlateEditor,
  useSlateEditorContext,
  useStaticSlateEditor,
} from './contexts';
import { DEFAULT_PLUGINS_OPTIONS, EditorAPI, PluginsOptions, PluginType } from './editor';
import { useEditorDecorate, useEditorForceNormalize, useEditorHotkeys, useSetupEditor } from './hooks';
import { defaultRenderElement, defaultRenderLeaf, defaultRenderPlaceholder } from './renderers';

/**
 * @deprecated use SlateEditable.PopperContent, SlateEditable.PopperTitle and etc instead
 */
export * from './components';
/**
 * @deprecated use SlateEditable.ControlledEditorProvider, SlateEditable.useSlateEditor and etc instead
 */
export { ControlledEditorProvider, useSlateEditor, useSlateEditorContext, useStaticSlateEditor } from './contexts';
export type { PluginsOptions as SlatePluginsOptions, VariableItem as SlateVariableItem } from './editor';
/**
 * @deprecated use SlateEditable.EditorAPI, SlateEditable.PluginType and etc instead
 */
export { EditorAPI as SlateEditorAPI, PluginType as SlatePluginType } from './editor';
/**
 * @deprecated use SlateEditable.useSetupEditor, SlateEditable.useEditorForceNormalize and etc instead
 */
export { useSetupEditor as useSetupSlateEditor, useEditorForceNormalize as useSlateEditorForceNormalize } from './hooks';

export type SlateValue = Descendant[];

export interface SlateEditableRef {
  focus: () => void;
  getContent: () => Descendant[];
}

export interface SlateEditableProps extends Omit<EditableProps, 'value' | 'autoFocus' | 'onChange' | 'decorate'> {
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

  const cache = useCache({ onBlur, onChange }, { onBlur, onChange });
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

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => EditorAPI.focus(editor),
      getContent: () => editor.children,
    }),
    [editor]
  );

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

export default Object.assign(React.forwardRef<SlateEditableRef, SlateEditableProps>(SlateEditable), {
  ...components,

  EditorAPI,
  PluginType,
  serializeToJSX: (content: BaseText.SlateTextValue, options?: { variablesMap?: Partial<Record<string, { id: string; name: string }>> }) =>
    serializeToJSX(content, { ...options, transformHref: getValidHref }),
  ControlledEditorProvider,

  useEditor: useSlateEditor,
  useSetupEditor,
  useStaticEditor: useStaticSlateEditor,
  useEditorContext: useSlateEditorContext,
  useEditorForceNormalize,
});
