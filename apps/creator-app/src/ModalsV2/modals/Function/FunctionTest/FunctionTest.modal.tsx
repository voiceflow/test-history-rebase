import type { Function as FunctionType } from '@voiceflow/dtos';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, Text, Theme } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { FunctionTestResponse } from '@/client/generalRuntime/types';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';
import { modalsManager } from '@/ModalsV2/manager';

import { IFunctionTestModal } from './FunctionTest.interface';
import { FunctionTestResult } from './FunctionTestResult/FunctionTestResult.component';
import { InputVariableEditor } from './InputVariableEditor/InputVariableEditor.component';

const TEST_FUNCTION_MODAL_STORAGE_KEY = 'TEST_FUNCTION_MODAL_STORAGE_KEY';
type Map = Record<string, string>;

export const FunctionTestModal = modalsManager.create<IFunctionTestModal, FunctionType>(
  'FunctionTestModal',
  () =>
    ({ api, type: typeProp, functionID, opened, hidden, animated }) => {
      const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });

      const { current: initialValues } = React.useRef(inputVariables.reduce<Map>((acc, variable) => ({ ...acc, [variable.name]: '' }), {} as Map));

      const testOne = useDispatch(Designer.Function.effect.testOne);
      const [isUploading, setIsUploading] = useState<boolean>(false);
      const [hasBeenExecuted, setHasBeenExecuted] = useState<boolean>(false);

      const [storedVariables, setStoredVariables] = useLocalStorageState<Map>(TEST_FUNCTION_MODAL_STORAGE_KEY, initialValues);
      const [localVariables, setLocalVariables] = useState<Map>(initialValues);
      const [testResponse, setTestResponse] = useState<FunctionTestResponse | null>({
        success: true,
        latencyMS: 38.03727996349335,
        runtimeCommands: {
          outputVars: {
            output: '',
          },
          next: {
            path: 'default',
          },
          trace: [
            {
              type: 'text',
              payload: {
                slate: {
                  id: 'dummy',
                  content: [
                    {
                      children: [
                        {
                          text: 'Converting  to ',
                        },
                      ],
                    },
                  ],
                },
                message: 'Converting  to ',
              },
            },
          ],
        },
      });

      const hasInputVariables = !!inputVariables.length;
      const hasStoredValues = Object.values(storedVariables).some(Boolean);

      const handleRestoreVariables = () => {
        setLocalVariables(storedVariables);
      };

      const onVariableChange = (variable: Map) => {
        setLocalVariables({ ...localVariables, ...variable });
      };

      const handleExecute = async () => {
        setIsUploading(true);

        try {
          const response = await testOne(functionID, localVariables);

          setIsUploading(false);
          setTestResponse(response);
        } finally {
          setStoredVariables(localVariables);
          setLocalVariables(initialValues);
          setHasBeenExecuted(true);
          setIsUploading(false);
        }
      };

      return (
        <Modal.Container
          stacked
          opened={opened}
          hidden={hidden}
          type={typeProp}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={handleExecute}
          width="400px"
        >
          <>
            <Modal.Header title="Test function" onClose={() => api.close()} />

            <Box id="paddings" gap={16} direction="column" px={24} pt={20} pb={hasInputVariables ? 24 : 20}>
              {inputVariables.map((variable, index) => {
                return (
                  <InputVariableEditor
                    key={variable.id}
                    variable={variable}
                    loading={isUploading}
                    setValue={(value) => onVariableChange({ [variable.name]: value })}
                    value={localVariables[variable.name]}
                    autoFocus={index === 0}
                  />
                );
              })}

              {!hasInputVariables && (
                <Text color={Theme.vars.color.font.default} variant="basic">
                  This function has no input variables.
                </Text>
              )}
            </Box>

            <Modal.Footer>
              {hasBeenExecuted && hasInputVariables && hasStoredValues ? (
                <Modal.Footer.Button label="Re-use last value(s)" onClick={handleRestoreVariables} variant="secondary" disabled={isUploading} />
              ) : (
                <Modal.Footer.Button label="Cancel" onClick={() => api.close()} variant="secondary" disabled={isUploading} />
              )}
              <Modal.Footer.Button label="Execute" disabled={isUploading} isLoading={isUploading} onClick={handleExecute} variant="primary" />
            </Modal.Footer>
          </>
          {testResponse && <FunctionTestResult functionsTestResponse={testResponse} disabled={isUploading} />}
        </Modal.Container>
      );
    }
);
