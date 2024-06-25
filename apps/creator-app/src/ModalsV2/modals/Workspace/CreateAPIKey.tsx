import { Box, Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import TextArea from '@/components/TextArea';
import { copy } from '@/utils/clipboard';

import manager from '../../manager';

enum CreateAPIKeyState {
  CONFIG = 'config',
  CREATING = 'creating',
  SHOW_KEY = 'showKey',
}

interface Props {
  dataName?: string;
  onCreate: (key: string) => void;
  workspaceID: string;
  projectID?: string;
}

const CreateAPIKey = manager.create<Props>(
  'CreateAPIKey',
  () =>
    ({ api, type, opened, hidden, animated, dataName, onCreate, workspaceID, projectID }) => {
      const [state, setState] = React.useState<CreateAPIKeyState>(CreateAPIKeyState.CONFIG);
      const [name, setName] = React.useState(dataName || '');
      const [apiKey, setAPIKey] = React.useState('');

      // reset state
      React.useEffect(() => {
        if (!opened) {
          return;
        }

        setAPIKey('');

        if (dataName) {
          setState(CreateAPIKeyState.SHOW_KEY);
          createAPIKey(dataName, projectID);
        } else {
          setName('');
          setState(CreateAPIKeyState.CONFIG);
        }
      }, [opened]);

      const createAPIKey = async (name?: string, projectID?: string) => {
        const { key: APIKey } = await client.api.apiKey.create(workspaceID, { name, projectID });
        toast.success('API key successfully created');
        setAPIKey(APIKey);
        setState(CreateAPIKeyState.SHOW_KEY);
        onCreate(APIKey);
      };

      const copyAPIKey = () => {
        copy(apiKey);
        toast.success('Copied to clipboard!');
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header>Create New API Key</Modal.Header>
          <Box width="100%">
            {state === CreateAPIKeyState.SHOW_KEY ? (
              <>
                <Modal.Body>
                  Please copy this key and store it somewhere secure. For security purposes,{' '}
                  <b>we can't show this key to you again.</b>
                  <Box mt={16}>
                    <TextArea disabled readOnly value={apiKey} placeholder="Generating API Key..." minRows={2} />
                  </Box>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={copyAPIKey}>Copy to Clipboard</Button>
                </Modal.Footer>
              </>
            ) : (
              <>
                <Modal.Body>
                  <label>Name</label>
                  <Input placeholder="API Key Name" value={name} onChangeText={setName} />
                </Modal.Body>
                <Modal.Footer>
                  <Button disabled={state === CreateAPIKeyState.CREATING} onClick={() => createAPIKey(name)}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Box>
        </Modal>
      );
    }
);

export default CreateAPIKey;
