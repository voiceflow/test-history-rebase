import type { Function as FunctionType } from '@voiceflow/dtos';
import { Box, Text, Theme, useCreateConst } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import type { GeneralRuntimeFunctionTestResponse } from '@/client/general-runtime/general-runtime.interface';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useEnvironmentSessionStorageState } from '@/hooks/storage.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { modalsManager } from '@/ModalsV2/manager';

import { formContentStyle, resultContentStyle } from './FunctionTest.css';
import type { IFunctionTestModal } from './FunctionTest.interface';
import { FunctionTestResult } from './FunctionTestResult/FunctionTestResult.component';
import { InputVariableEditor } from './InputVariableEditor/InputVariableEditor.component';

type Map = Record<string, string>;

export const FunctionTestModal = modalsManager.create<IFunctionTestModal, FunctionType>(
  'FunctionTestModal',
  () =>
    ({ api, type: typeProp, functionID, opened, hidden, animated }) => {
      const MODAL_ID = 'function-test-modal';

      const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, {
        functionID,
      });
      const outputVariableDeclarations = useSelector(Designer.Function.FunctionVariable.selectors.outputByFunctionID, {
        functionID,
      });

      const testOne = useDispatch(Designer.Function.effect.testOne);
      const trackError = useDispatch(Designer.Function.tracking.error);
      const trackTestExecuted = useDispatch(Designer.Function.tracking.testExecuted);

      const initialValues = useCreateConst(() =>
        Object.fromEntries(inputVariables.map((variable) => [variable.id, '']))
      );

      const [isUploading, setIsUploading] = useState<boolean>(false);
      const [testResponse, setTestResponse] = useState<GeneralRuntimeFunctionTestResponse | null>(null);
      const [isTraceOpened, setIsTraceOpened] = useState<boolean>(false);
      const [localVariables, setLocalVariables] = useState<Map>(initialValues);
      const [storedVariables, setStoredVariables] = useEnvironmentSessionStorageState<Map>(
        `${MODAL_ID}-variables:${functionID}`,
        initialValues
      );
      const [isOutputVarsOpened, setIsOutputVarsOpened] = useState<boolean>(true);
      const [isResolvedPathOpened, setIsResolvedPathOpened] = useState<boolean>(true);

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
          const variables = inputVariables.reduce<Map>(
            (acc, variable) => ({ ...acc, [variable.name]: localVariables[variable.id] }),
            {} as Map
          );

          const response = await testOne(functionID, variables);

          setIsUploading(false);
          setTestResponse(response);

          if (response.success) {
            trackTestExecuted({ success: 'Yes' });
          }

          if (response.success === false) {
            setIsTraceOpened(true);
            trackTestExecuted({ success: 'No' });
          }
        } catch (e) {
          trackError({ errorType: 'Execute' });
        } finally {
          setStoredVariables(localVariables);
          setLocalVariables(initialValues);
          setIsUploading(false);
        }
      };

      return (
        <Modal.Container
          width="400px"
          type={typeProp}
          opened={opened}
          hidden={hidden}
          stacked
          animated={animated}
          onExited={api.remove}
          className={[formContentStyle, resultContentStyle]}
          onEscClose={api.onEscClose}
          onEnterSubmit={handleExecute}
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
              {hasInputVariables && hasStoredValues ? (
                <Modal.Footer.Button
                  label="Re-use last value(s)"
                  onClick={handleRestoreVariables}
                  variant="secondary"
                  disabled={isUploading}
                />
              ) : (
                <Modal.Footer.Button
                  label="Cancel"
                  onClick={() => api.close()}
                  variant="secondary"
                  disabled={isUploading}
                />
              )}
              <Modal.Footer.Button
                label="Execute"
                disabled={isUploading}
                isLoading={isUploading}
                onClick={handleExecute}
                variant="primary"
              />
            </Modal.Footer>
          </>

          {testResponse && (
            <FunctionTestResult
              isTraceOpened={isTraceOpened}
              isResolvedPathOpened={isResolvedPathOpened}
              isOutputVarsOpened={isOutputVarsOpened}
              functionsTestResponse={testResponse}
              disabled={isUploading}
              numInputVariables={inputVariables.length ?? 0}
              outputVariableDeclarations={outputVariableDeclarations}
              setIsTraceOpened={setIsTraceOpened}
              setIsResolvedPathOpened={setIsResolvedPathOpened}
              setIsOutputVarsOpened={setIsOutputVarsOpened}
            />
          )}
        </Modal.Container>
      );
    }
);
