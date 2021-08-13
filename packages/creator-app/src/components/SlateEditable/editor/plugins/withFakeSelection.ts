import { Editor, Range, Text } from 'slate';

import type { EditorAPIType } from '../editorAPI';
import type { APIPlugin, Plugin } from './types';

const FAKE_SELECTION_PROPERTY_NAME = 'fakeSelection' as const;

export interface FakeSelectionText {
  [FAKE_SELECTION_PROPERTY_NAME]?: boolean;
}

export interface FakeSelectionEditor {
  applyFakeSelection: () => void;
  removeFakeSelection: () => void;
  setFakeSelectionRange: (fakeSelectionRange: Range) => void;
  isFakeSelectionApplied: () => boolean;
  getFakeSelectionTextStyles: (text: Text) => { backgroundColor?: string };
}

export interface FakeSelectionEditorAPI {
  FAKE_SELECTION_PROPERTY_NAME: typeof FAKE_SELECTION_PROPERTY_NAME;

  removeFakeSelectionAndFocus(editor: Editor): void;
}

export const withFakeSelectionPlugin: Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => {
  const { onChange: onOriginalChange } = editor;

  let originalSelection = editor.selection;
  let prevSelectionRange: Range | null = null;
  let fakeSelectionRange: Range | null = null;

  Object.defineProperty(editor, 'selection', {
    get: () => originalSelection || fakeSelectionRange,
    set: (selection) => {
      originalSelection = selection;
    },
  });

  editor.onChange = () => {
    if (editor.selection && EditorAPI.isFocused(editor)) {
      if (fakeSelectionRange && editor.selection !== prevSelectionRange) {
        fakeSelectionRange = null;
        EditorAPI.removeMarkFromAll(editor, FAKE_SELECTION_PROPERTY_NAME);
      }

      prevSelectionRange = editor.selection;
    }

    onOriginalChange();
  };

  const fakeSelectionEditor: FakeSelectionEditor = {
    applyFakeSelection: (): void => {
      EditorAPI.withoutSaving(editor, () => {
        if (fakeSelectionRange) {
          fakeSelectionRange = null;
          EditorAPI.removeMarkFromAll(editor, FAKE_SELECTION_PROPERTY_NAME);
        }

        if (prevSelectionRange && Range.isCollapsed(prevSelectionRange)) {
          fakeSelectionRange = prevSelectionRange;
          return;
        }

        fakeSelectionRange = prevSelectionRange ?? EditorAPI.fullRange(editor);

        const rangeRef = EditorAPI.rangeRef(editor, fakeSelectionRange);

        EditorAPI.setTextPropertyAtLocation(editor, fakeSelectionRange, FAKE_SELECTION_PROPERTY_NAME, true);

        fakeSelectionRange = rangeRef.unref();
      });
    },

    removeFakeSelection: (): void => {
      fakeSelectionRange = null;

      EditorAPI.withoutSaving(editor, () => {
        EditorAPI.removeMarkFromAll(editor, FAKE_SELECTION_PROPERTY_NAME);
      });
    },

    setFakeSelectionRange: (range: Range): void => {
      fakeSelectionRange = range;
    },

    isFakeSelectionApplied: (): boolean => !!fakeSelectionRange,

    getFakeSelectionTextStyles: (text: Text): { backgroundColor?: string } => ({
      backgroundColor: text[FAKE_SELECTION_PROPERTY_NAME] ? 'rgba(0,0,0,0.15)' : undefined,
    }),
  };

  return Object.assign(editor, fakeSelectionEditor);
};

export const withFakeSelectionEditorAPI: APIPlugin = (EditorAPI: EditorAPIType): EditorAPIType => {
  const FakeSelectionEditorAPI: FakeSelectionEditorAPI = {
    FAKE_SELECTION_PROPERTY_NAME,

    removeFakeSelectionAndFocus(editor: Editor): void {
      EditorAPI.withoutSaving(editor, () => {
        let { selection } = editor;

        if (!selection) {
          return;
        }

        const rangeRef = EditorAPI.rangeRef(editor, selection);

        editor.removeFakeSelection();

        selection = rangeRef.unref();

        if (selection) {
          EditorAPI.focus(editor);
          EditorAPI.setSelection(editor, selection);
        }
      });
    },
  };

  return Object.assign(EditorAPI, FakeSelectionEditorAPI);
};
