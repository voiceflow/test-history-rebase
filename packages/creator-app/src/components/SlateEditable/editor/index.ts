import { createEditor as createSlateEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import { compose } from '@/utils/functional';

import EditorAPI from './editorAPI';
import { withPlugins } from './plugins';
import { Editor } from './types';

export { EditorAPI };
export * from './types';

export const createEditor = (): Editor => compose(withPlugins(EditorAPI), withHistory, withReact)(createSlateEditor());
