import { useEditor } from '../EditorV2/hooks';
import { EditorV3Action } from './EditorV3.interface';

export { useEditor } from '../EditorV2/hooks';

export const useEditorV3DefaultActions = (): EditorV3Action[] => {
  const editor = useEditor();

  return [
    { label: 'Duplicate', icon: 'Duplicate', onClick: () => editor.engine.node.duplicateMany([editor.nodeID]) },
    { label: 'Delete', icon: 'Trash', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];
};
