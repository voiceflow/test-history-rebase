import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant, Tabs } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { useRequest, useRequestVariables } from '@/pages/Canvas/managers/Integration/hooks';

import { ResponseBody, ResponseHeaders, SetVariablesModal } from './components';
import { IntegrationEditorSendRequestModalTabs } from './constants';

const IntegrationEditorSendRequestModal: React.FC = () => {
  const { data, isOpened, close } = useModals<Realtime.NodeData.CustomApi>(ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL);
  const { variableValues, formattedData, hasVariables, updateVariableValue, normalizeAndSaveVariables } = useRequestVariables();
  const { response, sendRequest, cleanRequest, isLoading } = useRequest({ variableValues, formattedData });
  const [activeTab, setActiveTab] = React.useState<IntegrationEditorSendRequestModalTabs>(IntegrationEditorSendRequestModalTabs.BODY);

  React.useEffect(() => {
    if (!isOpened) {
      cleanRequest();
      return;
    }

    const usedVariables = normalizeAndSaveVariables(data);

    if (usedVariables?.length === 0) {
      sendRequest();
    }
  }, [isOpened]);

  if (hasVariables && !response) {
    return (
      <SetVariablesModal
        variableValues={variableValues}
        onCancel={close}
        onSendRequest={sendRequest}
        onChange={updateVariableValue}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Modal id={ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL} title="Test Request">
      <Modal.Body padding="0 32px 24px 32px">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.Tab value={IntegrationEditorSendRequestModalTabs.BODY}>Body</Tabs.Tab>
          <Tabs.Tab value={IntegrationEditorSendRequestModalTabs.HEADERS}>Headers</Tabs.Tab>
        </Tabs>

        {activeTab === IntegrationEditorSendRequestModalTabs.BODY && response && <ResponseBody response={response} />}
        {activeTab === IntegrationEditorSendRequestModalTabs.HEADERS && response && <ResponseHeaders response={response} />}
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

export default IntegrationEditorSendRequestModal;
