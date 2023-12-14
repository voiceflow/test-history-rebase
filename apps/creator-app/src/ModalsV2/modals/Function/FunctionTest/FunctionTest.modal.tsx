import type { Function as FunctionType } from '@voiceflow/dtos';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { testFunction } from '@/client/generalRuntime';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { modalsManager } from '@/ModalsV2/manager';

import { IFunctionTestModal } from './FunctionTest.interface';
import { InputVariableEditor } from './InputVariableEditor/InputVariableEditor.component';

const TEST_FUNCTION_MODAL_STORAGE_KEY = 'TEST_FUNCTION_MODAL_STORAGE_KEY';

export const FunctionTestModal = modalsManager.create<IFunctionTestModal, FunctionType>(
  'FunctionTestModal',
  () =>
    ({ api, type: typeProp, functionID, opened, hidden, animated }) => {
      const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });
      // const functionData = useSelector(Designer.Function.selectors.getOneByID, { id: functionID });
      const { current: initialValues } = React.useRef(
        inputVariables.reduce<Record<string, string>>((acc, variable) => ({ ...acc, [variable.name]: '' }), {} as Record<string, string>)
      );

      const [isUploading, setIsUploading] = useState<boolean>(false);
      const [hasBeenExecuted, setHasBeenExecuted] = useState<boolean>(false);

      const [storedVariables, setStoredVariables] = useLocalStorageState<Record<string, string>>(TEST_FUNCTION_MODAL_STORAGE_KEY, initialValues);
      const [localVariables, setLocalVariables] = useState<Record<string, string>>(initialValues);

      const [isSecondModalShown] = useState<boolean>(false);

      const handleRestoreVariables = () => {
        setLocalVariables({ ...localVariables, ...storedVariables });
      };

      const onVariableChange = (variable: Record<string, string>) => {
        setStoredVariables({ ...storedVariables, ...variable });
        setLocalVariables({ ...localVariables, ...variable });
      };

      const handleExecute = async () => {
        setIsUploading(true);

        try {
          setIsUploading(false);

          testFunction({
            functionDefinition: {} as any,
            inputMapping: {},
          });
        } finally {
          setLocalVariables(initialValues);
          setHasBeenExecuted(true);
          setIsUploading(false);
        }
      };

      return (
        <>
          <Modal.Container
            opened={opened}
            hidden={hidden}
            type={typeProp}
            animated={animated}
            onExited={api.remove}
            onEscClose={api.onEscClose}
            width="400px"
          >
            <Modal.Header title="Test function" onClose={() => api.close()} />

            <Box id="paddings" gap={16} direction="column" px={24} pt={20} pb={24}>
              {inputVariables.map((variable) => {
                return (
                  <InputVariableEditor
                    key={variable.id}
                    variable={variable}
                    loading={isUploading}
                    setValue={(value) => onVariableChange({ [variable.name]: value })}
                    value={localVariables[variable.name]}
                  />
                );
              })}
            </Box>

            <Modal.Footer>
              <Modal.Footer.Button
                label={hasBeenExecuted ? 'Re-use last value(s)' : 'Cancel'}
                onClick={handleRestoreVariables}
                variant="secondary"
                disabled={isUploading}
              />
              <Modal.Footer.Button label="Execute" disabled={isUploading} isLoading={isUploading} onClick={handleExecute} variant="primary" />
            </Modal.Footer>
          </Modal.Container>
          {isSecondModalShown && null}
        </>
      );
    }
);
