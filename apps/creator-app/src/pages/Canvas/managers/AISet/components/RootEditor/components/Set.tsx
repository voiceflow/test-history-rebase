import { BaseNode, BaseUtils } from '@voiceflow/base-types';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useVariableCreation } from '@/hooks';
import * as AI from '@/pages/Canvas/managers/components/AI';

interface SetSectionProps {
  set: BaseNode.AISet.Set;
  source: BaseUtils.ai.DATA_SOURCE;
  onUpdate: (path: Partial<BaseNode.AISet.Set>) => void;
  onRemove?: VoidFunction;
  removeDisabled: boolean;

  // TODO: KB_STEP_DEPRECATION
  isDeprecated: boolean;
}

export const MEMORY_SELECT_OPTIONS: AI.MemorySelectOption[] = [
  {
    mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
    label: 'Set variable using prompt',
    title: 'Prompt',
  },
  {
    mode: BaseUtils.ai.PROMPT_MODE.MEMORY_PROMPT,
    label: 'Set variable using memory and prompt',
    title: 'Memory & Prompt',
  },
];

const SetSection: React.FC<SetSectionProps> = ({ set, source, onUpdate, onRemove, removeDisabled, isDeprecated }) => {
  const { variables, createVariable } = useVariableCreation();

  return (
    <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />}>
      <Box.FlexColumn fullWidth gap={16} alignItems="stretch">
        {source === BaseUtils.ai.DATA_SOURCE.DEFAULT ? (
          <AI.MemorySelect value={set} onChange={onUpdate} options={MEMORY_SELECT_OPTIONS} />
        ) : (
          <>
            <AI.PromptInput value={set} onChange={onUpdate} placeholder="Enter query question" disabled={isDeprecated} />
            {!isDeprecated && (
              <VariablesInput
                placeholder="Enter instructions for response (optional)"
                value={set.instruction}
                onBlur={({ text: instruction }) => onUpdate({ instruction })}
                multiline
                autoFocus={false}
                newLineOnEnter
              />
            )}
          </>
        )}
        <VariableSelectV2
          disabled={isDeprecated}
          value={set.variable}
          prefix="APPLY TO"
          options={variables}
          onCreate={createVariable}
          onChange={(variable) => onUpdate({ variable })}
          placeholder="Select variable"
        />
      </Box.FlexColumn>
    </SectionV2.ListItem>
  );
};

export default SetSection;
