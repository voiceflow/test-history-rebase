import { BaseNode } from '@voiceflow/base-types';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useVariableCreation } from '@/hooks';

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
        <VariablesInput placeholder="Enter prompt" value={set.prompt} onBlur={({ text }) => onUpdate({ prompt: text })} multiline newLineOnEnter />
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
