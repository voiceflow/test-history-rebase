import { KeyName, useCache } from '@voiceflow/ui';
import React from 'react';
import { Editor } from 'slate';

import { Hotkey } from '../constants';
import { useStaticSlateEditor } from '../contexts';
import { EditorAPI } from '../editor';

export const useEditorHotkey = (key: Hotkey, callback: React.KeyboardEventHandler<HTMLDivElement>): void => {
  const editor = useStaticSlateEditor();

  const cache = useCache({ callback });

  React.useEffect(() => {
    editor.registerHotKey(key, (event) => cache.current.callback(event));

    return () => editor.unregisterHotKey(key);
  }, [key, editor]);
};

export const useEditorHotkeys = (
  editor: Editor,
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
): React.KeyboardEventHandler<HTMLDivElement> =>
  React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const isActionKey = event.ctrlKey || event.metaKey;

      if (event.key === KeyName.ESCAPE) {
        editor.removeFakeSelection();
        EditorAPI.deselect(editor);
        EditorAPI.blur(editor);
      }

      if (isActionKey) {
        editor.HotKeysHandlersMap[event.key]?.(event);
      }

      onKeyDown?.(event);
    },
    [editor]
  );
