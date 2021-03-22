import { createEditor, Editor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';

import { FakeSelectionEditor, withFakeSelection } from './fakeSelectionPlugin';
import { withLinks } from './linksPlugin';

export { default } from './editor';
export { fakeSelectionLeafStyles } from './fakeSelectionPlugin';

export type MarkupEditor = Editor & ReactEditor & HistoryEditor & FakeSelectionEditor;

export const createSlateEditor = (): MarkupEditor => withLinks(withFakeSelection(withHistory(withReact(createEditor()))));
