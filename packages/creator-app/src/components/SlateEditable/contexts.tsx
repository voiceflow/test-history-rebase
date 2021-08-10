import React from 'react';
import { Editor } from 'slate';

const EditorContext = React.createContext<[Editor] | null>(null);

const StaticEditorContext = React.createContext<Editor | null>(null);

export const { Provider: EditorContextProvider } = EditorContext;
export const { Provider: StaticEditorContextProvider } = StaticEditorContext;

interface EditorProviderProps {
  editor: Editor;
}

interface ControlledEditorProviderProps extends EditorProviderProps {
  contextKey: number;
}

export const ControlledEditorProvider: React.FC<ControlledEditorProviderProps> = ({ editor, contextKey, children }) => {
  const context = React.useMemo<[Editor]>(() => [editor], [contextKey]);

  return (
    <StaticEditorContext.Provider value={editor}>
      <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
    </StaticEditorContext.Provider>
  );
};

// rerenders on each editor change
export const useSlateEditor = (): Editor => {
  const [editor] = React.useContext(EditorContext)!;

  return editor;
};

// doesn't rerender on editor change, just provides editor
export const useStaticSlateEditor = (): Editor => {
  return React.useContext(StaticEditorContext)!;
};
