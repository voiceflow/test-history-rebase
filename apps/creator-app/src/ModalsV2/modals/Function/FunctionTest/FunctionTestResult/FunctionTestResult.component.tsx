import { Box, DotSeparator, Mapper, Scroll, Text, Variable } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import type { IFunctionTestResult } from './FunctionTestResult.interface';

export const FunctionTestResult: React.FC<IFunctionTestResult> = ({ functionID, functionTestResponse, onClose }) => {
  const outputVariables = useSelector(Designer.Function.FunctionVariable.selectors.outputByFunctionID, { functionID });

  return (
    <>
      <Modal.Header title="Function output" onClose={() => onClose?.()} />

      <Scroll pt={16}>
        {outputVariables.map((variable) => (
          <Box key={variable.id} direction="column" px={24} pb={5}>
            <Mapper
              leftHandSide={<Variable size="large" label={variable.name} />}
              rightHandSide={
                functionTestResponse?.outputMapping[variable.name] || <Text style={{ color: Tokens.colors.neutralDark.neutralsDark50 }}>null</Text>
              }
              equalityIcon="equal"
              key={variable.id}
            />
          </Box>
        ))}
      </Scroll>

      <Box direction="row" justify="space-between" px={24} pb={17} pt={10}>
        <Box direction="row" align="center">
          <Box>
            {functionTestResponse?.status === 'success' && (
              <Text variant="subcaption" style={{ color: Tokens.colors.success.success600 }}>
                Success
              </Text>
            )}
            {functionTestResponse?.status === 'error' && (
              <Text variant="subcaption" style={{ color: Tokens.colors.alert.alert700 }}>
                Error
              </Text>
            )}
          </Box>
          <DotSeparator thick light px={9} />
          <Text variant="subcaption" style={{ color: Tokens.colors.neutralLight.neutralsLight900 }}>
            {functionTestResponse?.latencyMS} ms
          </Text>
        </Box>
      </Box>
    </>
  );
};
