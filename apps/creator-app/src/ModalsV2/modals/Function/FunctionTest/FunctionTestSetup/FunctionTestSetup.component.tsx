import { Scroll } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import type { IFunctionTestSetup } from './FunctionTestSetup.interface';
import { InputVariableEditor } from './InputVariableEditor/InputVariableEditor.component';

export const FunctionTestSetup: React.FC<IFunctionTestSetup> = ({ setFunctionTestResponse, closePrevented, functionID, onClose, onNext }) => {
  const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, {
    functionID,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onTestRun = () => {
    setIsLoading(true);

    // TODO: implement actual api request to get function the test response

    setTimeout(() => {
      setFunctionTestResponse({
        status: 'error',
        latencyMS: 483,
        outputMapping: {
          credit_score: 780,
          credit_card_ID: 'authorization,contentlength,co  ntent-type,user-agent,x-applica tion-id,x-marial',
          last_update: 'August, 26th, 2023',
        },
      });

      setIsLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <>
      <Modal.Header title="Test function" onClose={() => onClose()} />

      <Scroll pt={20} pb={10}>
        {inputVariables.map((variable) => (
          <InputVariableEditor key={variable.id} variable={variable} />
        ))}
      </Scroll>
      <Modal.Footer>
        <Modal.Footer.Button variant="secondary" onClick={() => onClose()} disabled={closePrevented} label="Cancel" />

        <Modal.Footer.Button
          label={isLoading ? undefined : 'Run'}
          variant="primary"
          onClick={onTestRun}
          disabled={closePrevented}
          isLoading={isLoading}
        />
      </Modal.Footer>
    </>
  );
};
