import React from 'react';

import Box from '@/components/Box';
import { FlexApart } from '@/components/Flex';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section, { SectionVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { VariableTag } from '@/components/VariableTag';
import { FadeLeftContainer } from '@/styles/animations';

import Description from './Description';

export type ManagerProps = {
  variable: string;
  isBuiltIn?: boolean;
  description?: string;
  removeVariable: () => void;
};

const MAX_DISPLAYED_VAR_LENGTH = 30;

const Manager: React.FC<ManagerProps> = ({ variable, isBuiltIn, description, removeVariable }) => (
  <FadeLeftContainer mt={10}>
    <Section
      status={
        <Box mr={isBuiltIn ? 0 : 44}>
          <VariableTag>
            {`{${variable.length <= MAX_DISPLAYED_VAR_LENGTH ? variable : `${variable.substr(0, MAX_DISPLAYED_VAR_LENGTH - 3)}...`}}`}
          </VariableTag>
        </Box>
      }
      dividers={false}
      variant={SectionVariant.TERTIARY}
      header="Variable Name"
    >
      <FlexApart>
        <TextArea value={variable} readOnly disabled />

        {!isBuiltIn && <RemoveDropdown onRemove={removeVariable} />}
      </FlexApart>
    </Section>

    {description && <Description>{description}</Description>}
  </FadeLeftContainer>
);

export default Manager;
