import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { inputVariableContainerModifier } from '../Function.css';
import { VariableInput } from './Mapper/VariableInput.component';
import { VariableMapper } from './Mapper/VariableMapper.component';

interface FunctionInputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  inputMapping: Realtime.NodeData.Function['inputMapping'];
  functionID?: string;
}

export const FunctionInputVariables = ({ onChange, inputMapping, functionID }: FunctionInputVariablesProps) => {
  const functionVariableMap = React.useContext(FunctionVariableMapContext)!;
  const inputVariables = useMemoizedPropertyFilter(Object.values(functionVariableMap), { type: 'input', functionID });

  if (!functionID || !inputVariables.length) {
    return null;
  }

  return (
    <Collapsible
      isSection={true}
      isOpen={true}
      contentClassName={inputVariableContainerModifier}
      header={
        <CollapsibleHeader label="Input variable mapping">
          {({ isOpen, headerChildrenStyles }) => <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />}
        </CollapsibleHeader>
      }
    >
      {inputVariables.map(({ name, id, description = '' }) => {
        const left = inputMapping[name] || '';
        const right = name;
        const descriptionText = description ?? undefined;

        return (
          <VariableMapper
            leftHandInput={
              <VariableInput
                value={left}
                description={descriptionText}
                onChange={(value) =>
                  onChange({
                    inputMapping: {
                      ...inputMapping,
                      [name]: value,
                    },
                  })
                }
              />
            }
            rightHandInput={<Variable label={right} size="large" />}
            description={descriptionText}
            key={id}
          />
        );
      })}
    </Collapsible>
  );
};
