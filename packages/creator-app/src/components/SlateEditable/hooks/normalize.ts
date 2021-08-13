import React from 'react';
import { Editor } from 'slate';

// eslint-disable-next-line import/prefer-default-export
export const useEditorForceNormalize = (editor: Editor, deps: any[]) => {
  React.useEffect(() => {
    Editor.normalize(editor, { force: true });
  }, deps);
};
