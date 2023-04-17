import React from 'react';
import { Editor } from 'slate';

import { EditorContextProvider } from './EditorContext';

const StaticEditorContext = React.createContext<Editor | null>(null);

export const { Provider: StaticEditorContextProvider } = StaticEditorContext;

interface EditorProviderProps {
  editor: Editor;
}

interface ControlledEditorProviderProps extends EditorProviderProps, React.PropsWithChildren {
  contextKey: number;
}

export const ControlledEditorProvider: React.FC<ControlledEditorProviderProps> = ({ editor, contextKey, children }) => {
  const context = React.useMemo<[Editor]>(() => [editor], [contextKey]);

  return (
    <StaticEditorContext.Provider value={editor}>
      <EditorContextProvider value={context}>{children}</EditorContextProvider>
    </StaticEditorContext.Provider>
  );
};

// doesn't rerender on editor change, just provides editor
export const useStaticSlateEditor = (): Editor => {
  return React.useContext(StaticEditorContext)!;
};
