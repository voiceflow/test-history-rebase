import { useCache } from '@voiceflow/ui';
import React from 'react';
import { Descendant, Editor } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, Slate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

import { useForceUpdate } from '@/hooks';

import { DefaultElement, LinkElement, Text } from './components';
import { EditorContextProvider, StaticEditorContextProvider } from './contexts';
import { EditorAPI } from './editor';
import { useEditorHotkeys } from './hooks';

export * from './components';
export * from './contexts';
export { EditorAPI as SlateEditorAPI } from './editor';
export { useSetupEditor as useSetupSlateEditor } from './hooks';

export const defaultRenderElement = ({ element, ...props }: RenderElementProps): JSX.Element =>
  EditorAPI.isLink(element) ? <LinkElement {...props} element={element} /> : <DefaultElement {...props} element={element} />;

export const defaultRenderLeaf = (props: RenderLeafProps): JSX.Element => <Text {...props} />;

export type SlateValue = Descendant[];

interface SlateEditableRef {
  focus: () => void;
}

interface SlateEditableProps extends Omit<EditableProps, 'value' | 'onChange'> {
  value: SlateValue;
  editor: Editor;
  onChange: (value: SlateValue) => void;
  topToolbar?: React.ReactNode;
}

const SlateEditable: React.ForwardRefRenderFunction<SlateEditableRef, SlateEditableProps> = (
  { value, editor, onChange, children, topToolbar, renderLeaf = defaultRenderLeaf, renderElement = defaultRenderElement, ...editableProps },
  ref
) => {
  const [forceUpdate, contextKey] = useForceUpdate();

  const cache = useCache({ onChange });
  const onKeyDown = useEditorHotkeys(editor, editableProps.onKeyDown);

  const editorContext = React.useMemo<[Editor]>(() => [editor], [contextKey]);

  const onLocalChange = React.useCallback((value: Descendant[]) => {
    cache.current.onChange(value);
    forceUpdate();
  }, []);

  React.useImperativeHandle(ref, () => ({ focus: () => EditorAPI.focus(editor) }), [editor]);

  return (
    <StaticEditorContextProvider value={editor}>
      <EditorContextProvider value={editorContext}>
        {topToolbar}

        <Slate editor={editor} value={value} onChange={onLocalChange}>
          <Editable renderLeaf={renderLeaf} renderElement={renderElement} {...editableProps} onKeyDown={onKeyDown} />
        </Slate>

        {children}
      </EditorContextProvider>
    </StaticEditorContextProvider>
  );
};

export default React.forwardRef<SlateEditableRef, SlateEditableProps>(SlateEditable);
