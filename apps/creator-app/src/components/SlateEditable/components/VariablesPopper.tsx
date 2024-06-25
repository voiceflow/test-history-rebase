import React from 'react';
import type { Text } from 'slate';

import { SPACE_REGEXP } from '@/utils/string.util';

import { usePluginOptions, useSlateEditor } from '../contexts';
import { EditorAPI, PluginType } from '../editor';
import type { VariableItem } from '../editor/plugins';
import Suggestions from './Suggestions';

interface VariablesPopperProps {
  leaf: Text;
  textNode: HTMLElement;
}

const NOT_VALID_VAR_REGEXP = /\W/g;

const formatVariable = (variable: string): string =>
  variable.replace(SPACE_REGEXP, '_').replace(NOT_VALID_VAR_REGEXP, '');

const VariablesPopper: React.FC<VariablesPopperProps> = ({ leaf, textNode }) => {
  const editor = useSlateEditor();
  const { variables, creatable, onCreate, onAdded } = usePluginOptions(PluginType.VARIABLES) ?? {};

  const onSelect = React.useCallback(
    (variable: VariableItem) => {
      if (leaf.range) {
        EditorAPI.replaceWithVariable(editor, leaf.range, variable);

        onAdded?.(variable);
      }
    },
    [leaf.range, onAdded]
  );

  return (
    <Suggestions
      search={leaf.text}
      onSelect={onSelect}
      onCreate={onCreate}
      creatable={creatable}
      formatter={formatVariable}
      isSelected={leaf.isSelected}
      suggestions={variables}
      referenceNode={textNode}
      notFoundMessage="No variables found."
      notExistMessage="No variables exist."
      inputPlaceholder="Search variables"
    />
  );
};

export default VariablesPopper;
