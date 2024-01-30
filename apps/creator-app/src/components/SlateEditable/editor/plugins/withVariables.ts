import { Nullable, READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import { slate } from '@voiceflow/internal';
import * as Normal from 'normal-store';
import { Descendant, Editor, Element, Range, Text, Transforms } from 'slate';

import { ElementType } from '../../constants';
import type { EditorAPIType } from '../editorAPI';
import { PrismLanguage, PrismVariablesProperty } from '../prism';
import type { VariableElement } from '../types';
import { PluginType } from './constants';
import type { APIPlugin, Plugin } from './types';
import { matchAndProcessTextNodeToElement } from './utils';

export interface VariablesDecorate {
  [PrismVariablesProperty.VARIABLE]?: true;
}

export interface VariableItem {
  id: string;
  name: string;
  isSlot?: boolean;
}

export interface VariablesOptions {
  onAdded?: (variable: VariableItem) => void;
  onCreate?: (variable: string) => Nullable<VariableItem> | Promise<Nullable<VariableItem>>;
  variables?: Normal.Normalized<VariableItem>;
  creatable?: boolean;
  withSlots?: boolean;
}

export interface VariablesEditorAPI {
  isVariable: (node: Descendant) => node is VariableElement;
  replaceWithVariable: (editor: Editor, range: Range, variable: VariableItem) => void;
}

export const withVariablesPlugin: Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => {
  const { isVoid: originalIsVoid, isInline: originalIsInline, normalizeNode: originalNormalizeNode } = editor;

  editor.registerPrismLanguage(PrismLanguage.VARIABLES);

  editor.registerTextProcessingMiddleware(() => (next) => (nodes) => {
    const { variables } = editor.pluginsOptions[PluginType.VARIABLES] ?? {};

    const variablesNameMap = variables
      ? Object.values(variables.byKey).reduce<Record<string, VariableItem>>((acc, variable) => Object.assign(acc, { [variable.name]: variable }), {})
      : null;

    return nodes.flatMap((node) => {
      if (!Text.isText(node) || !variablesNameMap) {
        return next([node]);
      }

      return matchAndProcessTextNodeToElement({ type: ElementType.VARIABLE, node, next, regexp: READABLE_VARIABLE_REGEXP }, (match, textNode) => {
        const variable = variablesNameMap?.[match[1]] ?? null;

        // skip if not exists
        if (!variable) {
          return next([{ ...textNode, text: textNode.text + match[0] }]);
        }

        return [...next([textNode]), { ...variable, type: ElementType.VARIABLE, children: [{ text: '' }] }];
      });
    });
  });

  editor.isVoid = (element) => EditorAPI.isVariable(element) || originalIsVoid(element);

  editor.isInline = (element) => EditorAPI.isVariable(element) || originalIsInline(element);

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // if element is not variable, run original normalization
    if (!Element.isElement(node) || !EditorAPI.isVariable(node)) {
      originalNormalizeNode(entry);
      return;
    }

    const options = editor.pluginsOptions[PluginType.VARIABLES];

    // do nothing if variables not provided
    if (!options?.variables) {
      return;
    }

    const { variables, withSlots } = options;

    // do nothing if variable exists
    if (Normal.hasOne(variables, node.id)) {
      return;
    }

    // check if matched by name
    if (!withSlots && variables.allKeys.some((id) => Normal.getOne(variables, id)?.name === node.name)) {
      return;
    }

    // replace variable element with text node
    EditorAPI.withoutNormalizing(editor, () => {
      const pathRef = EditorAPI.pathRef(editor, path);

      Transforms.insertNodes(editor, { text: `{${node.name}}` }, { at: pathRef.current! });
      Transforms.removeNodes(editor, { at: pathRef.current! });

      pathRef.unref();
    });
  };

  return editor;
};

export const withVariablesEditorApi: APIPlugin = (EditorAPI: EditorAPIType): EditorAPIType => {
  const VariablesEditorAPI: VariablesEditorAPI = {
    isVariable: (node): node is VariableElement => Element.isElement(node) && slate.isVariableElement(node),

    replaceWithVariable: (editor: Editor, range: Range, variable: VariableItem) => {
      Transforms.insertNodes(
        editor,
        {
          ...variable,
          type: ElementType.VARIABLE,
          // empty text node as child is required for the all slate elements.
          children: [{ text: '' }],
        },
        { at: range, match: Text.isText }
      );

      // double move to move to the next character
      Transforms.move(editor);
      Transforms.move(editor);

      // space is required to work correctly
      Transforms.insertText(editor, ' ');

      if (!EditorAPI.isFocused(editor)) {
        EditorAPI.focus(editor);
      }
    },
  };

  return Object.assign(EditorAPI, VariablesEditorAPI);
};
