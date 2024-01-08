import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { inputVariableContainerModifier } from '../Function.css';
import { VariableMapper } from './Mapper/VariableMapper.component';
import { VariableSelect } from './Mapper/VariableSelect.component';

interface FunctionOutputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  outputMapping: Realtime.NodeData.Function['outputMapping'];
  functionID?: string;
}

export const FunctionOutputVariables = ({ onChange, outputMapping, functionID }: FunctionOutputVariablesProps) => {
  const functionVariableMap = React.useContext(FunctionVariableMapContext)!;
  const outputVariables = useMemoizedPropertyFilter(Object.values(functionVariableMap), { type: 'output', functionID });

  if (!functionID || !outputVariables.length) return null;

  return (
    <Collapsible
      isSection
      isOpen
      contentClassName={inputVariableContainerModifier}
      header={
        <CollapsibleHeader label="Output variable mapping">
          {({ isOpen, headerChildrenStyles }) => <CollapsibleHeaderButton headerChildrenStyles={headerChildrenStyles} isOpen={isOpen} />}
        </CollapsibleHeader>
      }
    >
      {outputVariables.map(({ name, id, description = '' }) => {
        const left = name;
        const right = outputMapping[name];
        const descriptionText = description ?? undefined;

        return (
          <VariableMapper
            leftHandInput={<Variable label={left} size="large" />}
            rightHandInput={
              <VariableSelect
                description={descriptionText}
                value={right || ''}
                onSelect={(value) =>
                  onChange({
                    outputMapping: {
                      ...outputMapping,
                      [name]: value,
                    },
                  })
                }
              />
            }
            description={descriptionText}
            key={id}
          />
        );
      })}
    </Collapsible>
  );
};
