import { Modal } from '@voiceflow/ui';
import React from 'react';

import { useSetup } from '@/hooks';

import manager from '../../../../manager';
import { TestRequest } from './components';
import { useRequest } from './hooks';

interface Props {
  data: Record<string, unknown>;
}

const SendRequest = manager.create<Props>('SendRequest', () => ({ api, type, opened, hidden, animated, data }) => {
  const { response, sendRequest, isLoading } = useRequest(data);

  useSetup(() => {
    sendRequest();
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <TestRequest response={response} sendRequest={sendRequest} isLoading={isLoading} close={api.close} />
    </Modal>
  );
});

export default SendRequest;
