import { compose } from '@voiceflow/ui';
import { createEditor as createSlateEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import EditorAPI from './editorAPI';
import type { PluginType } from './plugins';
import { withPlugins } from './plugins';
import type { Editor } from './types';

export { default as EditorAPI } from './editorAPI';
export type { PluginsOptions, VariableItem } from './plugins';
export { DEFAULT_PLUGINS_OPTIONS, PluginType } from './plugins';
export { default as Prism, PrismLanguage, PrismVariablesProperty } from './prism';
export * from './types';

export const createEditor = (plugins: PluginType[] = []): Editor =>
  compose(withPlugins(EditorAPI, plugins), withHistory, withReact)(createSlateEditor());
