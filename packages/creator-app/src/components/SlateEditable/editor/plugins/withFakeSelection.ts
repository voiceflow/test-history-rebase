import { Editor, Range, Text } from 'slate';

import type { EditorAPIType } from '../editorAPI';

const FAKE_SELECTION_PROPERTY_NAME = 'fakeSelection' as const;

export interface FakeSelectionText {
  [FAKE_SELECTION_PROPERTY_NAME]?: boolean;
}

export interface FakeSelectionEditor {
  applyFakeSelection: () => void;
  removeFakeSelection: () => void;
  getFakeSelectionRange: () => Range | null;
  setFakeSelectionRange: (fakeSelectionRange: Range) => void;
  isFakeSelectionApplied: () => boolean;
  getFakeSelectionTextStyles: (text: Text) => { backgroundColor?: string };
}

export interface FakeSelectionEditorAPI {
  FAKE_SELECTION_PROPERTY_NAME: typeof FAKE_SELECTION_PROPERTY_NAME;

  removeFakeSelectionAndFocus(editor: Editor): void;
}

export const withFakeSelectionPlugin =
  (EditorAPI: EditorAPIType) =>
  (editor: Editor): Editor => {
    const { onChange: onOriginalChange } = editor;

    let prevSelectionRange: Range | null = null;
    let fakeSelectionRange: Range | null = null;

    editor.onChange = () => {
      if (editor.selection && EditorAPI.isFocused(editor)) {
        if (fakeSelectionRange && editor.selection !== prevSelectionRange) {
          fakeSelectionRange = null;
          EditorAPI.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
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
            EditorAPI.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
          }

          if (prevSelectionRange && Range.isCollapsed(prevSelectionRange)) {
            fakeSelectionRange = prevSelectionRange;
            return;
          }

          fakeSelectionRange = prevSelectionRange ?? EditorAPI.fullRange(editor);

          const rangeRef = EditorAPI.rangeRef(editor, fakeSelectionRange);

          EditorAPI.setTextPropertyAtRange(editor, fakeSelectionRange, FAKE_SELECTION_PROPERTY_NAME, true);

          fakeSelectionRange = rangeRef.unref();
        });
      },

      removeFakeSelection: (): void => {
        fakeSelectionRange = null;

        EditorAPI.withoutSaving(editor, () => {
          EditorAPI.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
        });
      },

      setFakeSelectionRange: (range: Range): void => {
        fakeSelectionRange = range;
      },

      getFakeSelectionRange: (): Range | null => fakeSelectionRange,

      isFakeSelectionApplied: (): boolean => !!fakeSelectionRange,

      getFakeSelectionTextStyles: (text: Text): { backgroundColor?: string } => ({
        backgroundColor: text[FAKE_SELECTION_PROPERTY_NAME] ? 'rgba(0,0,0,0.15)' : undefined,
      }),
    };

    return Object.assign(editor, fakeSelectionEditor);
  };

export const withFakeSelectionEditorAPI = (EditorAPI: EditorAPIType): EditorAPIType => {
  const FakeSelectionEditorAPI: FakeSelectionEditorAPI = {
    FAKE_SELECTION_PROPERTY_NAME,

    removeFakeSelectionAndFocus(editor: Editor): void {
      EditorAPI.withoutSaving(editor, () => {
        let fakeSelectionRange = editor.getFakeSelectionRange();

        if (!fakeSelectionRange) {
          return;
        }

        const rangeRef = EditorAPI.rangeRef(editor, fakeSelectionRange);

        editor.removeFakeSelection();

        fakeSelectionRange = rangeRef.unref();

        if (fakeSelectionRange) {
          EditorAPI.focus(editor);
          EditorAPI.setSelection(editor, fakeSelectionRange);
        }
      });
    },
  };

  return Object.assign(EditorAPI, FakeSelectionEditorAPI);
};
