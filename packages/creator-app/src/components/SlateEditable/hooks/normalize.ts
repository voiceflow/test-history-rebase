import React from 'react';
import { Editor } from 'slate';

export const useEditorForceNormalize = (editor: Editor, deps: any[]) => {
  React.useEffect(() => {
    Editor.normalize(editor, { force: true });
  }, deps);
};
