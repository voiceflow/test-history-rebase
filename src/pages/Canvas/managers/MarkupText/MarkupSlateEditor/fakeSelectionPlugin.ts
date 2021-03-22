import { Range, Text } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

import type { MarkupEditor } from '.';
import MarkupSlateEditor from './editor';

const PROPERTY_NAME = 'fakeSelection';

export interface FakeSelectionEditor {
  applyFakeSelection: () => void;
  removeFakeSelection: () => void;
  getFakeSelectionRange: () => Range | null;
  setFakeSelectionRange: (fakeSelectionRange: Range) => void;
  isFakeSelectionApplied: () => boolean;
}

export const withFakeSelection = <T extends ReactEditor & HistoryEditor>(baseEditor: T): MarkupEditor => {
  const editor = (baseEditor as any) as MarkupEditor;
  const { onChange } = editor;

  let prevSelectionRange: Range | null = null;
  let fakeSelectionRange: Range | null = null;

  editor.onChange = () => {
    if (editor.selection && MarkupSlateEditor.isFocused(editor)) {
      if (fakeSelectionRange && editor.selection !== prevSelectionRange) {
        fakeSelectionRange = null;
        MarkupSlateEditor.unsetLeafPropertyAtAll(editor, PROPERTY_NAME);
      }

      prevSelectionRange = editor.selection;
    }

    onChange();
  };

  editor.applyFakeSelection = () => {
    if (fakeSelectionRange) {
      fakeSelectionRange = null;
      MarkupSlateEditor.unsetLeafPropertyAtAll(editor, PROPERTY_NAME);
    }

    if (prevSelectionRange && Range.isCollapsed(prevSelectionRange)) {
      fakeSelectionRange = prevSelectionRange;
      return;
    }

    fakeSelectionRange = prevSelectionRange ?? MarkupSlateEditor.fullRange(editor);

    const rangeRef = MarkupSlateEditor.rangeRef(editor, fakeSelectionRange);

    MarkupSlateEditor.setLeafPropertyAtRange(editor, fakeSelectionRange, PROPERTY_NAME, true);

    fakeSelectionRange = rangeRef.unref();
  };

  editor.removeFakeSelection = () => {
    fakeSelectionRange = null;
    MarkupSlateEditor.unsetLeafPropertyAtAll(editor, PROPERTY_NAME);
  };

  editor.setFakeSelectionRange = (range: Range) => {
    fakeSelectionRange = range;
  };

  editor.getFakeSelectionRange = () => fakeSelectionRange;

  editor.isFakeSelectionApplied = () => !!fakeSelectionRange;

  return editor;
};

export const fakeSelectionLeafStyles = (text: Text): { backgroundColor?: string } => ({
  backgroundColor: text[PROPERTY_NAME] ? 'rgba(0,0,0,0.15)' : undefined,
});
