import { Box, FlexApart, Input } from '@voiceflow/ui';
import React from 'react';

import RemoveDropdown from '@/components/RemoveDropdown';
import Section, { SectionVariant } from '@/components/Section';
import { VariableTag } from '@/components/VariableTag';
import { FadeLeftContainer } from '@/styles/animations';

import Description from './Description';

export type ManagerProps = {
  variable: string;
  isBuiltIn?: boolean;
  description?: string;
  removeVariable: () => void;
};

const Manager: React.FC<ManagerProps> = ({ variable, isBuiltIn, description, removeVariable }) => (
  <FadeLeftContainer mt={10}>
    <Section
      status={
        <Box mr={isBuiltIn ? 0 : 44}>
          <VariableTag>{`{${variable}}`}</VariableTag>
        </Box>
      }
      dividers={false}
      variant={SectionVariant.TERTIARY}
      header="Variable Name"
    >
      <FlexApart>
        <Input value={variable} disabled />

        {!isBuiltIn && <RemoveDropdown onRemove={removeVariable} />}
      </FlexApart>
    </Section>

    {description && <Description>{description}</Description>}
  </FadeLeftContainer>
);

export default Manager;
