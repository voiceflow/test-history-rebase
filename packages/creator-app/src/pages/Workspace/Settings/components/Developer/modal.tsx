import React from 'react';

import client from '@/client';
import Box from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import TextArea from '@/components/TextArea';
import { toast } from '@/components/Toast';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { copy } from '@/utils/clipboard';

enum CreateAPIKeyState {
  CONFIG = 'config',
  CREATING = 'creating',
  SHOW_KEY = 'showKey',
}

const CreateAPIKeyModal: React.FC = () => {
  const [state, setState] = React.useState<CreateAPIKeyState>(CreateAPIKeyState.CONFIG);
  const [name, setName] = React.useState('');
  const [apiKey, setAPIKey] = React.useState('');
  const { isOpened, data } = useModals<{ name?: string; onCreate: (key: string) => void; workspaceID: string; projectID?: string }>(
    ModalType.API_KEY_CREATE
  );

  // reset state
  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    setAPIKey('');
    if (data.name) {
      setState(CreateAPIKeyState.SHOW_KEY);
      createAPIKey(data.name, data.projectID);
    } else {
      setName('');
      setState(CreateAPIKeyState.CONFIG);
    }
  }, [isOpened]);

  const createAPIKey = async (name: string, projectID?: string) => {
    const { APIKey } = await client.api.apiKey.create(data.workspaceID, { name, projectID });
    toast.success('API key successfully created');
    setAPIKey(APIKey);
    setState(CreateAPIKeyState.SHOW_KEY);
    data.onCreate(APIKey);
  };

  const copyAPIKey = () => {
    copy(apiKey);
    toast.success('Copied to clipboard!');
  };

  return (
    <Modal id={ModalType.API_KEY_CREATE} title="Create New API Key">
      <Box width="100%">
        {state === CreateAPIKeyState.SHOW_KEY ? (
          <>
            <ModalBody>
              Please copy this key and store it somewhere secure. For security purposes, <b>we can't show this key to you again.</b>
              <Box mt={16}>
                <TextArea disabled readOnly value={apiKey} placeholder="Generating API Key..." minRows={2} />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button onClick={copyAPIKey}>Copy to Clipboard</Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody>
              <label>Name</label>
              <Input placeholder="API Key Name" value={name} onChange={(e) => setName(e.target.value)} />
            </ModalBody>
            <ModalFooter>
              <Button disabled={state === CreateAPIKeyState.CREATING} onClick={() => createAPIKey(name)}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreateAPIKeyModal;
