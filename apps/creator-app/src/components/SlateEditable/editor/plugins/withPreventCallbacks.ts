/* eslint-disable no-param-reassign */
import { Editor } from 'slate';

import type { Plugin } from './types';

export interface PreventCallbacksEditor {
  blurPrevented: boolean;

  preventBlur: (callback: VoidFunction) => void;
}
export const withPreventCallbacksPlugin: Plugin = () => (editor: Editor) => {
  const preventCallbacks: PreventCallbacksEditor = {
    blurPrevented: false,

    preventBlur: (callback: VoidFunction) => {
      editor.blurPrevented = true;

      // eslint-disable-next-line callback-return
      callback();

      editor.blurPrevented = false;
    },
  };

  return Object.assign(editor, preventCallbacks);
};
