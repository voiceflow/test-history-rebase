import { BlockText, BoxFlex, FlexApart, Input } from '@voiceflow/ui';
import React from 'react';

import RemoveDropdown from '@/components/RemoveDropdown';
import Section, { SectionVariant } from '@/components/Section';
import { VariableTag } from '@/components/VariableTag';
import { FadeLeftContainer } from '@/styles/animations';

import Description from './Description';

export interface ManagerProps {
  variable: string;
  isBuiltIn?: boolean;
  description?: string;
  removeVariable: () => void;
}

const Manager: React.FC<ManagerProps> = ({ variable, isBuiltIn, description, removeVariable }) => (
  <FadeLeftContainer mt={10}>
    <Section
      status={
        <BoxFlex pr={isBuiltIn ? 0 : 44} maxWidth="100%">
          <VariableTag>{variable}</VariableTag>
        </BoxFlex>
      }
      header={<BlockText minWidth={110}>Variable Name</BlockText>}
      variant={SectionVariant.TERTIARY}
      dividers={false}
      truncatedHeader={false}
      hiddenStatusContent
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
