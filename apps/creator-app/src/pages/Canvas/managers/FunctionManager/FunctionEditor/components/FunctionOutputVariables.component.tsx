import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { inputVariableContainerModifier } from '../Function.css';
import { ReadOnlySlateInput, VariableMapper, VariableSelect } from './VariableMapper.component';

interface FunctionOutputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  outputMapping: Realtime.NodeData.Function['outputMapping'];
  functionID?: string;
}

export const FunctionOutputVariables = ({ onChange, outputMapping, functionID }: FunctionOutputVariablesProps) => {
  const functionVariableMap = React.useContext(FunctionVariableMapContext)!;
  const outputVariables = useMemoizedPropertyFilter(Object.values(functionVariableMap), { type: 'output', functionID });

  if (!functionID || !outputVariables.length) {
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
      {outputVariables.map(({ name, id, description = '' }) => {
        const left = name;
        const right = outputMapping[name];
        const descriptionText = description ?? undefined;

        return (
          <VariableMapper
            leftHandInput={<ReadOnlySlateInput value={left} description={descriptionText} />}
            rightHandInput={
              <VariableSelect
                value={right || ''}
                description={descriptionText}
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
