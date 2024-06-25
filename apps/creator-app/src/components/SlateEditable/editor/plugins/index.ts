import { compose } from '@voiceflow/ui';
import type { Editor, Range } from 'slate';

import type { EditorAPIType } from '../editorAPI';
import { InternalPluginType, PluginType } from './constants';
import type { Plugin } from './types';
import type { BasePluginEditor } from './withBasePlugin';
import { withBasePlugin } from './withBasePlugin';
import type { FakeSelectionEditor, FakeSelectionEditorAPI, FakeSelectionText } from './withFakeSelection';
import { withFakeSelectionEditorAPI, withFakeSelectionPlugin } from './withFakeSelection';
import type { HotkeysEditor } from './withHotkeys';
import { withHotkeysPlugin } from './withHotkeys';
import type { LinksEditorAPI } from './withLinks';
import { withLinksEditorApi, withLinksPlugin } from './withLinks';
import type { PreventCallbacksEditor } from './withPreventCallbacks';
import { withPreventCallbacksPlugin } from './withPreventCallbacks';
import type { VariablesDecorate, VariablesEditorAPI, VariablesOptions } from './withVariables';
import { withVariablesEditorApi, withVariablesPlugin } from './withVariables';

export { PluginType } from './constants';
export type { VariableItem } from './withVariables';

interface PluginsDecorate extends VariablesDecorate {
  range?: Range;
  isSelected?: boolean;
}

export interface PluginsOptions {
  [PluginType.VARIABLES]?: VariablesOptions;
}

export interface PluginsEditorAPI extends LinksEditorAPI, VariablesEditorAPI, FakeSelectionEditorAPI {}

export interface PluginsText extends FakeSelectionText, PluginsDecorate {}

export interface PluginsRange extends PluginsDecorate {}

export interface PluginsEditor extends FakeSelectionEditor, HotkeysEditor, PreventCallbacksEditor, BasePluginEditor {
  pluginsMap: Partial<Record<PluginType, true>>;
  pluginsOptions: PluginsOptions;
}

export const DEFAULT_PLUGINS_OPTIONS: PluginsOptions = {};

const PLUGIN_MAP: Record<PluginType | InternalPluginType, Plugin> = {
  [PluginType.LINKS]: withLinksPlugin,
  [PluginType.VARIABLES]: withVariablesPlugin,
  [InternalPluginType.BASE]: withBasePlugin,
  [InternalPluginType.HOTKEYS]: withHotkeysPlugin,
  [InternalPluginType.FAKE_SELECTION]: withFakeSelectionPlugin,
  [InternalPluginType.PREVENT_CALLBACKS]: withPreventCallbacksPlugin,
};

const INTERNAL_PLUGINS_ORDER = [
  InternalPluginType.BASE,
  InternalPluginType.FAKE_SELECTION,
  InternalPluginType.PREVENT_CALLBACKS,
  InternalPluginType.HOTKEYS,
];

const PUBLIC_PLUGINS_ORDER = [
  // variables should be above links to support variables inside links
  PluginType.VARIABLES,
  PluginType.LINKS,
];

export const withPluginsEditorAPI = (EditorAPI: EditorAPIType): EditorAPIType =>
  compose(withLinksEditorApi, withVariablesEditorApi, withFakeSelectionEditorAPI)(EditorAPI);

export const withPlugins =
  (EditorAPI: EditorAPIType, pluginsTypes: PluginType[] = []) =>
  (editor: Editor): Editor => {
    const pluginsMap = pluginsTypes.reduce<Partial<Record<PluginType, true>>>(
      (acc, pluginType) => Object.assign(acc, { [pluginType]: true }),
      {}
    );

    const pluginsTypesOrder = PUBLIC_PLUGINS_ORDER.map((type) => (pluginsMap[type] ? type : null)).filter(
      Boolean
    ) as PluginType[];
    const plugins = [...INTERNAL_PLUGINS_ORDER, ...pluginsTypesOrder].map((type) => PLUGIN_MAP[type](EditorAPI));

    editor.pluginsMap = pluginsMap;
    editor.pluginsOptions = {};

    return plugins.reduce((editor, plugin) => plugin(editor), editor);
  };
