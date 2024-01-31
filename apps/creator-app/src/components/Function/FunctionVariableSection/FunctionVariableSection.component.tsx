import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { stopPropagation } from '@/utils/handler.util';

import { FunctionResourceInput } from '../FunctionResourceInput/FunctionResourceInput.component';
import type { IFunctionVariableSection } from './FunctionVariableSection.interface';

export const FunctionVariableSection: React.FC<IFunctionVariableSection> = ({
  title,
  autoFocusKey,
  functionVariables,
  onFunctionVariableAdd,
  onDeleteFunctionVariable,
  onFunctionVariableChange,
  testID,
}) => {
  const hasVariables = !!functionVariables.length;

  return (
    <>
      <Box pt={11} pb={hasVariables ? 0 : 11}>
        <Section.Header.Container
          title={title}
          variant={hasVariables ? 'active' : 'basic'}
          onHeaderClick={hasVariables ? undefined : onFunctionVariableAdd}
          testID={testID}
        >
          <Section.Header.Button iconName="Plus" onClick={stopPropagation(onFunctionVariableAdd)} testID={testID} />
        </Section.Header.Container>
      </Box>

      {hasVariables && (
        <Box pb={10} direction="column" testID={`${testID}__list`}>
          {functionVariables.map((functionVariable, index) => (
            <CMSFormListItem pt={9} pb={7} key={index} onRemove={() => onDeleteFunctionVariable(functionVariable.id)} testID={`${testID}__list-item`}>
              <FunctionResourceInput
                onDescriptionChange={(description) => onFunctionVariableChange(functionVariable.id, { description })}
                onValueChange={(name) => onFunctionVariableChange(functionVariable.id, { name })}
                description={functionVariable.description || ''}
                descriptionPlaceholder="Add instructions (optional)"
                namePlaceholder="Enter variable name"
                value={functionVariable.name}
                autoFocus={functionVariable.id === autoFocusKey}
                testID="function__variable"
              />
            </CMSFormListItem>
          ))}
        </Box>
      )}
    </>
  );
};
