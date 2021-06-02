import { Editor, Range, Text } from 'slate';

import { FAKE_SELECTION_PROPERTY_NAME } from '../constants';
import MarkupSlateEditor from './editor';

export interface FakeSelectionEditor {
  applyFakeSelection: () => void;
  removeFakeSelection: () => void;
  getFakeSelectionRange: () => Range | null;
  setFakeSelectionRange: (fakeSelectionRange: Range) => void;
  isFakeSelectionApplied: () => boolean;
}

export const withFakeSelection = (editor: Editor): Editor => {
  const { onChange } = editor;

  let prevSelectionRange: Range | null = null;
  let fakeSelectionRange: Range | null = null;

  editor.onChange = () => {
    if (editor.selection && MarkupSlateEditor.isFocused(editor)) {
      if (fakeSelectionRange && editor.selection !== prevSelectionRange) {
        fakeSelectionRange = null;
        MarkupSlateEditor.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
      }

      prevSelectionRange = editor.selection;
    }

    onChange();
  };

  editor.applyFakeSelection = () => {
    if (fakeSelectionRange) {
      fakeSelectionRange = null;
      MarkupSlateEditor.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
    }

    if (prevSelectionRange && Range.isCollapsed(prevSelectionRange)) {
      fakeSelectionRange = prevSelectionRange;
      return;
    }

    fakeSelectionRange = prevSelectionRange ?? MarkupSlateEditor.fullRange(editor);

    const rangeRef = MarkupSlateEditor.rangeRef(editor, fakeSelectionRange);

    MarkupSlateEditor.setTextPropertyAtRange(editor, fakeSelectionRange, FAKE_SELECTION_PROPERTY_NAME, true);

    fakeSelectionRange = rangeRef.unref();
  };

  editor.removeFakeSelection = () => {
    fakeSelectionRange = null;
    MarkupSlateEditor.unsetTextPropertyAtAll(editor, FAKE_SELECTION_PROPERTY_NAME);
  };

  editor.setFakeSelectionRange = (range: Range) => {
    fakeSelectionRange = range;
  };

  editor.getFakeSelectionRange = () => fakeSelectionRange;

  editor.isFakeSelectionApplied = () => !!fakeSelectionRange;

  return editor;
};

export const fakeSelectionLeafStyles = (text: Text): { backgroundColor?: string } => ({
  backgroundColor: text[FAKE_SELECTION_PROPERTY_NAME] ? 'rgba(0,0,0,0.15)' : undefined,
});
