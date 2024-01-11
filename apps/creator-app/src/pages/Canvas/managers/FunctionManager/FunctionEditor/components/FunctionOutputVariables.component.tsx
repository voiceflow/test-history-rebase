import * as Realtime from '@voiceflow/realtime-sdk';
import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';
import { markupToSlate } from '@/utils/markup.util';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { createSlateVariable, findFirstVariable } from '../../FunctionManager.utils';
import { inputVariableContainerModifier } from '../Function.css';
import { VariableInput } from './Mapper/VariableInput.component';
import { VariableMapper } from './Mapper/VariableMapper.component';

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
        const right = createSlateVariable(outputMapping[name]);
        const descriptionText = description ?? undefined;
        const left = name;

        return (
          <VariableMapper
            leftHandInput={<Variable label={left} size="large" />}
            rightHandInput={
              <VariableInput
                description={descriptionText}
                placeholder="Apply to {var}"
                maxVariableWidth="110px"
                value={right}
                onChange={(value) => {
                  onChange({
                    outputMapping: {
                      ...outputMapping,
                      [name]: findFirstVariable(markupToSlate.fromDB(value)),
                    },
                  });
                }}
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
