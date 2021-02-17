import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import Box, { FlexApart } from '@/components/Box';
import Page from '@/components/Page';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import { ModalType } from '@/constants';
import { setConfirm } from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { useModals } from '@/hooks';
import { APIKey } from '@/models/APIKey';

import CreateAPIKeyModal from './modal';

const APIKeyPage: React.FC = () => {
  const dispatch = useDispatch();
  const goToDashboard = () => dispatch(Router.goToDashboard());
  const workspaceID = useSelector(Workspace.activeWorkspaceIDSelector)!;

  const { open: openCreateModal } = useModals(ModalType.API_KEY_CREATE);

  const [apiKeys, setAPIKeys] = React.useState<APIKey[]>([]);

  const fetchAPIKeys = React.useCallback(async () => {
    try {
      setAPIKeys(await client.workspace.listAPIKeys(workspaceID));
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  }, [workspaceID]);

  const deleteKey = React.useCallback(async (key: string) => {
    await client.api.apiKey.delete(key);
    fetchAPIKeys();
  }, []);

  const confirmDeleteKey = React.useCallback(
    (key: string) => () =>
      dispatch(
        setConfirm({
          text: 'Are you sure you want to delete this API key? Any services consuming this key will fail.',
          warning: true,
          confirm: () => deleteKey(key),
        })
      ),
    []
  );

  React.useEffect(() => {
    fetchAPIKeys();
  }, []);

  return (
    <Page
      navigateBackText="Back"
      onNavigateBack={goToDashboard}
      header={
        <Box style={{ whiteSpace: 'nowrap' }}>
          <h2>API Keys</h2>
        </Box>
      }
    >
      <Box width={900} m="0 auto" p={60}>
        <FlexApart>
          <b>({apiKeys.length}) Existing API Keys</b>
          <ClickableText
            onClick={() =>
              openCreateModal({
                workspaceID,
                onCreate: fetchAPIKeys,
              })
            }
          >
            Create New API Key
          </ClickableText>
        </FlexApart>
        {apiKeys.map((key) => (
          <Box key={key._id}>
            <hr />
            <FlexApart mb={8}>
              <div>
                <b>{key.name}</b>
                <br />
                {`VF.${key._id}.XXX...`}
              </div>
              <ClickableText onClick={confirmDeleteKey(key._id)}>Delete</ClickableText>
            </FlexApart>
          </Box>
        ))}
      </Box>
      <CreateAPIKeyModal />
    </Page>
  );
};

export default APIKeyPage;
