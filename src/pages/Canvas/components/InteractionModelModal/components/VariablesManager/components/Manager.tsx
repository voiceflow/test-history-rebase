import React from 'react';

import { FlexApart } from '@/components/Flex';
import Input from '@/components/Input';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import { FadeLeftContainer } from '@/styles/animations/FadeHorizontal';

import Description from './Description';
import VariableTag from './VariableTag';

export type ManagerProps = {
  variable: string;
  isBuiltIn?: boolean;
  description?: string;
  removeVariable: () => void;
};

const Manager: React.FC<ManagerProps> = ({ variable, isBuiltIn, description, removeVariable }) => {
  return (
    <FadeLeftContainer style={{ marginTop: 10 }}>
      <Section status={<VariableTag>{`{${variable}}`}</VariableTag>} dividers={false} variant="tertiary" header="Variable Name">
        <FlexApart>
          <Input value={variable} disabled />

          {!isBuiltIn && <RemoveDropdown onRemove={removeVariable} />}
        </FlexApart>
      </Section>

      {description && <Description>{description}</Description>}
    </FadeLeftContainer>
  );
};

export default Manager;
