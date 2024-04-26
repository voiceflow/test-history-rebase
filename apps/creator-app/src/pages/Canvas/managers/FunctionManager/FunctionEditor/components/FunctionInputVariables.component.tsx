import type * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';
import { toSorted } from '@/utils/sort.util';

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
  const sortedInputVariables = React.useMemo(
    () => toSorted(inputVariables, { getKey: (elem) => new Date(elem.createdAt).getTime() }),
    [inputVariables]
  );

  if (!functionID || !sortedInputVariables.length) return null;

  return (
    <Collapsible
      isSection
      isOpen
      contentClassName={inputVariableContainerModifier}
      header={
        <CollapsibleHeader label="Input variable mapping">
          {({ isOpen, headerChildrenStyles }) => (
            <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />
          )}
        </CollapsibleHeader>
      }
    >
      {sortedInputVariables.map(({ name, id, description = '' }) => {
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
            rightHandInput={<Variable label={right} size="large" maxWidth="118px" />}
            description={descriptionText}
            key={id}
          />
        );
      })}
    </Collapsible>
  );
};
