import { Box, BoxFlexApart, ClickableText, Dropdown, IconButton, IconButtonVariant, Spinner, Text, toast } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import { SettingsSection } from '@/components/Settings';
import { TableContainer, TableRow } from '@/components/Table';
import { ModalType } from '@/constants';
import { setConfirm } from '@/ducks/modal';
import * as Session from '@/ducks/session';
import { useModals } from '@/hooks';
import { APIKey } from '@/models/APIKey';
import * as Sentry from '@/vendors/sentry';

import CreateAPIKeyModal from './modal';

const APIKeyPage: React.FC = () => {
  const dispatch = useDispatch();
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const { open: openCreateModal } = useModals(ModalType.API_KEY_CREATE);

  const [apiKeys, setAPIKeys] = React.useState<APIKey[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAPIKeys = React.useCallback(async () => {
    try {
      setAPIKeys(await client.workspace.listAPIKeys(workspaceID));
    } catch (error) {
      Sentry.error(error);
      toast.error(error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <SettingsSection title="API Keys">
        <Spinner isMd />
      </SettingsSection>
    );
  }

  return (
    <SettingsSection title="API Keys">
      <BoxFlexApart px={32} py={24}>
        <Text color="secondary">({apiKeys.length}) Existing API Keys</Text>
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
      </BoxFlexApart>
      {!!apiKeys.length && (
        <TableContainer topBorder columns={[1]}>
          {apiKeys.map(({ _id: keyID, name }) => (
            <TableRow key={keyID}>
              <Box py={16}>
                {name}
                <Box color="secondary" mt={6}>{`VF.${keyID}.XXX...`}</Box>
              </Box>
              <Dropdown
                options={[
                  {
                    label: 'Delete',
                    onClick: confirmDeleteKey(keyID),
                  },
                ]}
                placement="bottom-end"
              >
                {(ref, onToggle, isOpen) => (
                  <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                )}
              </Dropdown>
            </TableRow>
          ))}
        </TableContainer>
      )}
      <CreateAPIKeyModal />
    </SettingsSection>
  );
};

export default APIKeyPage;
