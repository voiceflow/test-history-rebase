import React from 'react';
import { Editor } from 'slate';

const EditorContext = React.createContext<[Editor] | null>(null);

export const { Provider: EditorContextProvider } = EditorContext;

export const useSlateEditorContext = (): [Editor] => React.useContext(EditorContext)!;

// rerenders on each editor change(includes selection and etc)
export const useSlateEditor = (): Editor => {
  const [editor] = useSlateEditorContext();

  return editor;
};
