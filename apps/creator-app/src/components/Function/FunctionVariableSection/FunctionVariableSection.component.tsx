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
  autoFocusKey,
}) => {
  const variableSize = !!functionVariables?.length;
  return (
    <>
      <Box py={11} pb={variableSize ? 0 : 11} direction="column">
        <Section.Header.Container
          onHeaderClick={variableSize ? undefined : onFunctionVariableAdd}
          variant={variableSize ? 'active' : 'basic'}
          title={title}
        >
          <Section.Header.Button iconName="Plus" onClick={variableSize ? onFunctionVariableAdd : undefined} />
        </Section.Header.Container>
      </Box>

      {variableSize && (
        <Box pb={10} direction="column">
          {functionVariables.map((functionVariable, index) => (
            <CMSFormListItem pt={9} pb={7} key={index} onRemove={() => onDeleteFunctionVariable(functionVariable.id)}>
              <FunctionResourceInput
                onDescriptionChange={(description) => onFunctionVariableChange(functionVariable.id, { description })}
                onValueChange={(name) => onFunctionVariableChange(functionVariable.id, { name })}
                description={functionVariable.description || ''}
                descriptionPlaceholder="Add instructions (optional)"
                namePlaceholder="Enter variable name"
                value={functionVariable.name}
                autoFocus={functionVariable.id === autoFocusKey}
              />
            </CMSFormListItem>
          ))}
        </Box>
      )}
    </>
  );
};
