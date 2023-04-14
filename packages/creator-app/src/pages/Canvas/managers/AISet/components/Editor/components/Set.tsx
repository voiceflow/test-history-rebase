import { BaseNode, BaseUtils } from '@voiceflow/base-types';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import { useVariableCreation } from '@/hooks';
import * as AI from '@/pages/Canvas/managers/components/AI';

interface SetSectionProps {
  set: BaseNode.AISet.Set;
  onUpdate: (path: Partial<BaseNode.AISet.Set>) => void;
  onRemove?: VoidFunction;
  removeDisabled: boolean;
}

const SetSection: React.FC<SetSectionProps> = ({ set, onUpdate, onRemove, removeDisabled }) => {
  const { variables, createVariable } = useVariableCreation();

  return (
    <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />}>
      <Box.FlexColumn fullWidth gap={16} alignItems="stretch">
        <AI.MemorySelect
          value={set}
          onChange={onUpdate}
          actionPrefix="Set variable using"
          options={[BaseUtils.ai.PROMPT_MODE.PROMPT, BaseUtils.ai.PROMPT_MODE.MEMORY_PROMPT]}
        />
        <VariableSelectV2
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
