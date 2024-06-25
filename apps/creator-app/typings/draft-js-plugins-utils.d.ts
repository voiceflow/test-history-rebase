declare module 'draft-js-plugins-utils' {
  import type { EditorState, EntityInstance } from 'draft-js';

  const Utils: {
    getCurrentEntity(editorState: EditorState): EntityInstance | null;
    getCurrentEntityKey(editorState: EditorState): string | null;
  };

  export default Utils;
}
