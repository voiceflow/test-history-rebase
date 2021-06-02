import './types';

import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import { withFakeSelection } from './fakeSelectionPlugin';
import { withLinks } from './linksPlugin';

export { default } from './editor';
export { fakeSelectionLeafStyles } from './fakeSelectionPlugin';
export * from './types';

export const createSlateEditor = (): Editor => withLinks(withFakeSelection(withHistory(withReact(createEditor()))));
