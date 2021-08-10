/* eslint-disable @typescript-eslint/no-empty-interface */
import { Editor } from 'slate';

import { compose } from '@/utils/functional';

import type { EditorAPIType } from '../editorAPI';
import {
  FakeSelectionEditor,
  FakeSelectionEditorAPI,
  FakeSelectionText,
  withFakeSelectionEditorAPI,
  withFakeSelectionPlugin,
} from './withFakeSelection';
import { HotkeysEditor, withHotkeysPlugin } from './withHotkeys';
import { LinksEditorAPI, withLinksEditorApi, withLinksPlugin } from './withLinks';

export interface PluginsEditorAPI extends LinksEditorAPI, FakeSelectionEditorAPI {}

export interface PluginsText extends FakeSelectionText {}

export interface PluginsEditor extends FakeSelectionEditor, HotkeysEditor {}

export const withPluginsEditorAPI = (EditorAPI: EditorAPIType): EditorAPIType => compose(withLinksEditorApi, withFakeSelectionEditorAPI)(EditorAPI);

export const withPlugins =
  (EditorAPI: EditorAPIType) =>
  (editor: Editor): Editor =>
    compose(...[withHotkeysPlugin, withLinksPlugin, withFakeSelectionPlugin].map((plugin) => plugin(EditorAPI)))(editor);
