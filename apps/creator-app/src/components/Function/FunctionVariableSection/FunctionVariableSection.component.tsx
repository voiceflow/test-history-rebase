import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';

import { FunctionResourceInput } from '../FunctionResourceInput/FunctionResourceInput.component';
import type { IFunctionVariableSection } from './FunctionVariableSection.interface';

export const FunctionVariableSection: React.FC<IFunctionVariableSection> = ({
  title,
  functionVariables,
  onFunctionVariableAdd,
  onDeleteFunctionVariable,
  onFunctionVariableChange,
}) => {
  return (
    <Box gap={5} pt={10} pb={5} direction="column">
      <Box mb={5}>
        <Section.Header.Container title={title} variant={functionVariables?.length ? 'active' : 'basic'}>
          <Section.Header.Button iconName="Plus" onClick={() => onFunctionVariableAdd()} />
        </Section.Header.Container>
      </Box>

      {functionVariables?.map((functionVariable, index) => (
        <CMSFormListItem mb={10} key={index} onRemove={() => onDeleteFunctionVariable(functionVariable.id)}>
          <FunctionResourceInput
            value={functionVariable.name}
            description={functionVariable.description || ''}
            onDescriptionChange={(description) => onFunctionVariableChange(functionVariable.id, { description })}
            onValueChange={(name) => onFunctionVariableChange(functionVariable.id, { name })}
            namePlaceholder="Enter variable name"
            descriptionPlaceholder="Add instructions (optional)"
          />
        </CMSFormListItem>
      ))}
    </Box>
  );
};
