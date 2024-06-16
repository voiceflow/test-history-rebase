import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { markupToSlate } from '@/utils/markup.util';
import { toSorted } from '@/utils/sort.util';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { createSlateVariable, findFirstVariable } from '../../FunctionManager.utils';
import { inputVariableContainerModifier } from '../Function.css';
import { VariableInput } from './Mapper/VariableInput.component';
import { VariableMapper } from './Mapper/VariableMapper.component';

interface FunctionOutputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  functionID: string | null;
  outputMapping: Realtime.NodeData.Function['outputMapping'];
}

export const FunctionOutputVariables = ({ onChange, outputMapping, functionID }: FunctionOutputVariablesProps) => {
  const functionVariables = useSelector(Designer.Function.FunctionVariable.selectors.all);

  const outputVariables = useMemoizedPropertyFilter(
    functionVariables,
    { type: 'output', functionID: functionID ?? undefined },
    [functionVariables, functionID]
  );
  const sortedOutputVariables = React.useMemo(
    () => toSorted(outputVariables, { getKey: (elem) => new Date(elem.createdAt).getTime() }),
    [outputVariables]
  );

  if (!functionID || !sortedOutputVariables.length) return null;

  return (
    <Collapsible
      isSection
      isOpen
      contentClassName={inputVariableContainerModifier}
      header={
        <CollapsibleHeader label="Output variable mapping">
          {({ isOpen, headerChildrenStyles }) => (
            <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />
          )}
        </CollapsibleHeader>
      }
    >
      {sortedOutputVariables.map(({ name, id, description = '' }) => (
        <VariableMapper
          key={id}
          description={description}
          leftHandInput={<Variable label={name} size="large" maxWidth="115px" />}
          rightHandInput={
            <VariableInput
              value={createSlateVariable(outputMapping[name])}
              placeholder="Apply to {var}"
              maxVariableWidth="118px"
              onChange={(value) => {
                onChange({
                  outputMapping: { ...outputMapping, [name]: findFirstVariable(markupToSlate.fromDB(value)) },
                });
              }}
            />
          }
        />
      ))}
    </Collapsible>
  );
};
