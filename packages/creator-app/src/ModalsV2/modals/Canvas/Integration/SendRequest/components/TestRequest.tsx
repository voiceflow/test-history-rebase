import { Button, ButtonVariant, Modal, Tabs } from '@voiceflow/ui';
import React from 'react';

import { ModalTabs } from '../constants';
import { Response } from '../types';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';

interface Props {
  response: Response | null;
  sendRequest: () => Promise<void>;
  isLoading: boolean;
  close: VoidFunction;
}

const TestRequest: React.FC<Props> = ({ response, sendRequest, isLoading, close }) => {
  const [activeTab, setActiveTab] = React.useState<ModalTabs>(ModalTabs.BODY);

  return (
    <>
      <Modal.Header>Test Request</Modal.Header>
      <Modal.Body>
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
    </>
  );
};

export default TestRequest;
