import type { Function as FunctionType } from '@voiceflow/dtos';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, Text, Theme } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { FunctionTestResponse } from '@/client/generalRuntime/types';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useSelector } from '@/hooks';
import { modalsManager } from '@/ModalsV2/manager';

import { modalContainerRecipe } from './FunctionTest.css';
import { IFunctionTestModal } from './FunctionTest.interface';
import { FunctionTestResult } from './FunctionTestResult/FunctionTestResult.component';
import { InputVariableEditor } from './InputVariableEditor/InputVariableEditor.component';

const TEST_FUNCTION_MODAL_STORAGE_KEY = 'TEST_FUNCTION_MODAL_STORAGE_KEY';
type Map = Record<string, string>;

const FUNCTION_TEST_MODAL_ID = 'FunctionTestModal';

export const FunctionTestModal = modalsManager.create<IFunctionTestModal, FunctionType>(
  FUNCTION_TEST_MODAL_ID,
  () =>
    ({ api, type: typeProp, functionID, opened, hidden, animated }) => {
      const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });

      const { current: initialValues } = React.useRef(inputVariables.reduce<Map>((acc, variable) => ({ ...acc, [variable.id]: '' }), {} as Map));

      const testOne = useDispatch(Designer.Function.effect.testOne);
      const [isUploading, setIsUploading] = useState<boolean>(false);
      const [hasBeenExecuted, setHasBeenExecuted] = useState<boolean>(false);

      const trackCMSFunctionsError = useDispatch(Tracking.trackCMSFunctionsError);
      const trackCMSFunctionsTestExecuted = useDispatch(Tracking.trackCMSFunctionsTestExecuted);

      const [storedVariables, setStoredVariables] = useLocalStorageState<Map>(TEST_FUNCTION_MODAL_STORAGE_KEY, initialValues);
      const [localVariables, setLocalVariables] = useState<Map>(initialValues);

      const [testResponse, setTestResponse] = useState<FunctionTestResponse | null>(null);

      const [isTraceOpened, setIsTraceOpened] = useState<boolean>(testResponse?.success === false);
      const [isResolvedPathOpened, setIsResolvedPathOpened] = useState<boolean>(true);
      const [isOutputVarsOpened, setIsOutputVarsOpened] = useState<boolean>(true);

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
          const variables = inputVariables.reduce<Map>((acc, variable) => ({ ...acc, [variable.name]: localVariables[variable.id] }), {} as Map);

          const response = await testOne(functionID, variables);

          setIsUploading(false);
          setTestResponse(response);

          if (response.success) {
            trackCMSFunctionsTestExecuted({ Success: 'Yes' });
          }

          if (response.success === false) {
            setIsTraceOpened(true);
            trackCMSFunctionsTestExecuted({ Success: 'No' });
          }
        } catch (e) {
          trackCMSFunctionsError({ ErrorType: 'Execute' });
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
          className={modalContainerRecipe({ isResponseModalOpen: !!testResponse })}
          containerClassName={modalContainerRecipe({ isResponseModalOpen: !!testResponse })}
        >
          <>
            <Modal.Header title="Test function" onClose={() => api.close()} />

            <Box
              id="paddings"
              gap={16}
              direction="column"
              px={24}
              pt={20}
              pb={hasInputVariables ? 24 : 20}
              overflow="auto"
              maxHeight={testResponse && inputVariables.length > 3 ? '256px' : 'none'}
            >
              {inputVariables.map((variable, index) => {
                return (
                  <InputVariableEditor
                    key={variable.id}
                    variable={variable}
                    loading={isUploading}
                    setValue={(value) => onVariableChange({ [variable.id]: value })}
                    value={localVariables[variable.id]}
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

          {testResponse && (
            <FunctionTestResult
              isTraceOpened={isTraceOpened}
              isResolvedPathOpened={isResolvedPathOpened}
              isOutputVarsOpened={isOutputVarsOpened}
              functionsTestResponse={testResponse}
              disabled={isUploading}
              inputVariables={inputVariables.length ?? 0}
              setIsTraceOpened={setIsTraceOpened}
              setIsResolvedPathOpened={setIsResolvedPathOpened}
              setIsOutputVarsOpened={setIsOutputVarsOpened}
            />
          )}
        </Modal.Container>
      );
    }
);
