import type { Function as FunctionType } from '@voiceflow/dtos';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { Switch } from '@/components/Switch';
import { modalsManager } from '@/ModalsV2/manager';

import { FunctionTestScreen } from './FunctionTest.enum';
import type { IFunctionTestModal, IFunctionTestResponse } from './FunctionTest.interface';
import { FunctionTestResult } from './FunctionTestResult/FunctionTestResult.component';
import { FunctionTestSetup } from './FunctionTestSetup/FunctionTestSetup.component';

export const FunctionTestModal = modalsManager.create<IFunctionTestModal, FunctionType>(
  'FunctionTestModal',
  () =>
    ({ api, type: typeProp, functionID, opened, hidden, animated, closePrevented }) => {
      const [screen, setScreen] = useState<FunctionTestScreen>(FunctionTestScreen.FUNCTION_TEST_SETUP);
      const [functionTestResponse, setFunctionTestResponse] = useState<IFunctionTestResponse | undefined>();

      return (
        <Modal.Container type={typeProp} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Switch value={screen}>
            <Switch.Pane value={FunctionTestScreen.FUNCTION_TEST_SETUP}>
              <FunctionTestSetup
                onNext={() => setScreen(FunctionTestScreen.FUNCTION_TEST_RESULT)}
                onClose={api.close}
                functionID={functionID}
                closePrevented={closePrevented}
                setFunctionTestResponse={setFunctionTestResponse}
              />
            </Switch.Pane>

            <Switch.Pane value={FunctionTestScreen.FUNCTION_TEST_RESULT}>
              <FunctionTestResult functionTestResponse={functionTestResponse} functionID={functionID} onClose={api.close} onNext={api.close} />
            </Switch.Pane>
          </Switch>
        </Modal.Container>
      );
    }
);
