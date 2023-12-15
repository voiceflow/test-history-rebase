import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { Box, Input, Mapper, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionVariableMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';

interface FunctionOutputVariablesProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  outputMapping: Realtime.NodeData.Function['outputMapping'];
  functionID?: string;
}

export const FunctionOutputVariables = ({ onChange, outputMapping, functionID }: FunctionOutputVariablesProps) => {
  const functionVariableMap = React.useContext(FunctionVariableMapContext)!;
  const outputVariables = useMemoizedPropertyFilter(Object.values(functionVariableMap), { type: 'output', functionID });

  if (!functionID || !outputVariables.length || true) {
    return null;
  }

  return (
    <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Output variable mapping</SectionV2.Title>}>
      <Box width="100%" direction="column" ml={-15}>
        {outputVariables.map(({ name, id }) => {
          const left = name;
          const right = outputMapping[name] || '';

          return (
            <Mapper
              key={id}
              leftHandSide={
                <Box width="100%" ml={15}>
                  <Variable label={left} />
                </Box>
              }
              rightHandSide={
                <Box width="100%">
                  <Input
                    variant="ghost"
                    value={right}
                    onValueChange={(value) =>
                      onChange({
                        outputMapping: {
                          ...outputMapping,
                          [name]: value,
                        },
                      })
                    }
                    placeholder="Value or {var}"
                  />
                </Box>
              }
              equalityIcon="equal"
            />
          );
        })}
      </Box>
    </SectionV2.SimpleContentSection>
  );
};
