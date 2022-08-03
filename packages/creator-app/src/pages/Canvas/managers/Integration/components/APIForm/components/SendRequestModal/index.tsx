import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant, Tabs } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { BaseFormProps } from '../../types';
import { ResponseBody, ResponseHeaders, SetVariablesModal } from './components';
import { ModalTabs } from './constants';
import { useRequest, useRequestVariables } from './hooks';

const SendRequestModal: React.FC<BaseFormProps> = ({ editor }) => {
  const [activeTab, setActiveTab] = React.useState<ModalTabs>(ModalTabs.BODY);

  const { isOpened, close } = useModals<Realtime.NodeData.CustomApi>(ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL);

  const { variableValues, formattedData, hasVariables, updateVariableValue, normalizeAndSaveVariables } = useRequestVariables();
  const { response, sendRequest, cleanRequest, isLoading } = useRequest({ variableValues, formattedData });

  React.useEffect(() => {
    if (!isOpened) {
      cleanRequest();
      return;
    }

    const usedVariables = normalizeAndSaveVariables(editor.data);

    if (usedVariables?.length === 0) {
      sendRequest();
    }
  }, [isOpened]);

  if (hasVariables && !response) {
    return (
      <SetVariablesModal
        onCancel={close}
        onChange={updateVariableValue}
        isLoading={isLoading}
        onSendRequest={sendRequest}
        variableValues={variableValues}
      />
    );
  }

  return (
    <Modal id={ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL} title="Test Request">
      <Modal.Body padding="0 32px 24px 32px">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.Tab value={ModalTabs.BODY}>Body</Tabs.Tab>
          <Tabs.Tab value={ModalTabs.HEADERS}>Headers</Tabs.Tab>
        </Tabs>

        {activeTab === ModalTabs.BODY && response && <ResponseBody response={response} />}
        {activeTab === ModalTabs.HEADERS && response && <ResponseHeaders response={response} />}
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '12px' }} onClick={close}>
          Cancel
        </Button>

        <Button style={{ width: 104 }} onClick={sendRequest} disabled={isLoading} isLoading={isLoading} squareRadius>
          Re-Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendRequestModal;
