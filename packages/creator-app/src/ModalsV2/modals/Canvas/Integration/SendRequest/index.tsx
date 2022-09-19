import * as Realtime from '@voiceflow/realtime-sdk';
import { Modal } from '@voiceflow/ui';
import React from 'react';

import { useSetup } from '@/hooks';

import manager from '../../../../manager';
import { SetVariables, TestRequest } from './components';
import { useRequest, useRequestVariables } from './hooks';

interface Props {
  data: Realtime.NodeData.CustomApi;
}

const SendRequest = manager.create<Props>('SendRequest', () => ({ api, type, opened, hidden, animated, data }) => {
  const { variableValues, formattedData, hasVariables, updateVariableValue, normalizeAndSaveVariables } = useRequestVariables();
  const { response, sendRequest, isLoading } = useRequest({ variableValues, formattedData });

  useSetup(() => {
    const usedVariables = normalizeAndSaveVariables(data);
    if (usedVariables?.length === 0) {
      sendRequest();
    }
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      {hasVariables && !response ? (
        <SetVariables
          variableValues={variableValues}
          updateVariableValue={updateVariableValue}
          sendRequest={sendRequest}
          isLoading={isLoading}
          close={api.close}
        />
      ) : (
        <TestRequest response={response} sendRequest={sendRequest} isLoading={isLoading} close={api.close} />
      )}
    </Modal>
  );
});

export default SendRequest;
