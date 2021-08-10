import React from 'react';
import { Editor } from 'slate';

import type { Hotkey } from '../../constants';
import type { EditorAPIType } from '../editorAPI';

export interface HotkeysEditor {
  HotKeysHandlersMap: Partial<Record<string, React.KeyboardEventHandler<HTMLDivElement>>>;

  registerHotKey: (key: Hotkey, callback: React.KeyboardEventHandler<HTMLDivElement>) => void;
  unregisterHotKey: (key: Hotkey) => void;
}

export const withHotkeysPlugin =
  (_EditorAPI: EditorAPIType) =>
  (editor: Editor): Editor => {
    const hotkeysEditor: HotkeysEditor = {
      HotKeysHandlersMap: {},

      registerHotKey: (key: Hotkey, callback: React.KeyboardEventHandler<HTMLDivElement>) => {
        hotkeysEditor.HotKeysHandlersMap[key] = callback;
      },

      unregisterHotKey: (key: Hotkey) => {
        delete hotkeysEditor.HotKeysHandlersMap[key];
      },
    };

    return Object.assign(editor, hotkeysEditor);
  };
