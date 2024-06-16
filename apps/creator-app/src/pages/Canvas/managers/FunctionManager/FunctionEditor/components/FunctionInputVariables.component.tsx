import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { toSorted } from '@/utils/sort.util';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { inputVariableContainerModifier } from '../Function.css';
import { VariableInput } from './Mapper/VariableInput.component';
import { VariableMapper } from './Mapper/VariableMapper.component';

interface FunctionInputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  functionID: string | null;
  inputMapping: Realtime.NodeData.Function['inputMapping'];
}

export const FunctionInputVariables = ({ onChange, functionID, inputMapping }: FunctionInputVariablesProps) => {
  const functionVariables = useSelector(Designer.Function.FunctionVariable.selectors.all);

  const inputVariables = useMemoizedPropertyFilter(
    functionVariables,
    { type: 'input', functionID: functionID ?? undefined },
    [functionVariables, functionID]
  );
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
      {sortedInputVariables.map(({ name, id, description }) => (
        <VariableMapper
          key={id}
          description={description}
          leftHandInput={
            <VariableInput
              value={inputMapping[name] || ''}
              onChange={(value) => onChange({ inputMapping: { ...inputMapping, [name]: value } })}
            />
          }
          rightHandInput={<Variable label={name} size="large" maxWidth="118px" />}
        />
      ))}
    </Collapsible>
  );
};
