import React from 'react';
import { Alert } from 'reactstrap';

import client from '@/client';
import Box from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Text, { ClickableText } from '@/components/Text';
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
  const { isOpened, data } = useModals<{ onCreate: () => void; workspaceID: string }>(ModalType.API_KEY_CREATE);

  // reset state
  React.useEffect(() => {
    setName('');
    setAPIKey('');
    setState(CreateAPIKeyState.CONFIG);
  }, [isOpened]);

  const createAPIKey = async () => {
    const { APIKey } = await client.api.apiKey.create(data.workspaceID, { name });
    setAPIKey(APIKey);
    setState(CreateAPIKeyState.SHOW_KEY);
    data.onCreate();
  };

  const copyAPIKey = () => {
    copy(apiKey);
    toast.success('successfully copied API Key');
  };

  return (
    <Modal id={ModalType.API_KEY_CREATE} title="Create New API Key">
      {state === CreateAPIKeyState.SHOW_KEY ? (
        <ModalBody>
          <Box textAlign="center">
            <Alert>
              <b>API Key Successfully Created</b>
            </Alert>
            <Alert>
              Please copy this key and save it somewhere safe
              <br />
              <Text color="#f00">For security reasons, we can never show it to you again.</Text>
            </Alert>
            <Box mt={16}>
              <TextArea disabled readOnly value={apiKey} />
            </Box>
            <ClickableText onClick={copyAPIKey}>Copy to Clipboard</ClickableText>
          </Box>
        </ModalBody>
      ) : (
        <Box width="100%">
          <ModalBody>
            <label>Name</label>
            <Input placeholder="API Key Name" value={name} onChange={(e) => setName(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button disabled={state === CreateAPIKeyState.CREATING} onClick={createAPIKey}>
              Confirm
            </Button>
          </ModalFooter>
        </Box>
      )}
    </Modal>
  );
};

export default CreateAPIKeyModal;
