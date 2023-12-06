import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { Box, Mapper, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';

interface FunctionInputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  inputMapping: Realtime.NodeData.Function['inputMapping'];
  functionID?: string;
}

export const FunctionInputVariables = ({ onChange, inputMapping, functionID }: FunctionInputVariablesProps) => {
  const functionVariableMap = React.useContext(FunctionVariableMapContext)!;
  const inputVariables = useMemoizedPropertyFilter(Object.values(functionVariableMap), { type: 'input', functionID });

  return (
    <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Input variable mapping</SectionV2.Title>}>
      <Box width="100%" direction="column" ml={-15}>
        {inputVariables.map(({ name, id }) => {
          const left = inputMapping[name] || '';
          const right = name;

          return (
            <Mapper
              key={id}
              leftHandSide={
                <Box width="100%" mt={-10}>
                  <InputWithVariables
                    variant="ghost"
                    value={left}
                    onValueChange={(value) =>
                      onChange({
                        inputMapping: {
                          ...inputMapping,
                          [name]: value,
                        },
                      })
                    }
                    placeholder="Value or {var}"
                  />
                </Box>
              }
              rightHandSide={<Variable label={right} />}
              equalityIcon="equal"
            />
          );
        })}
      </Box>
    </SectionV2.SimpleContentSection>
  );
};
