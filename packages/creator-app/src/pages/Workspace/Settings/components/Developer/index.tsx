import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ClickableText, Dropdown, IconButton, IconButtonVariant, Spinner, Text, toast } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import * as Settings from '@/components/Settings';
import { TableContainer, TableRow } from '@/components/Table';
import * as Feature from '@/ducks/feature';
import { setConfirm } from '@/ducks/modal';
import * as Session from '@/ducks/session';
import * as ModalsV2 from '@/ModalsV2';
import { APIKey } from '@/models';
import { getErrorMessage } from '@/utils/error';
import * as Sentry from '@/vendors/sentry';

const APIKeyPage: React.FC = () => {
  const dispatch = useDispatch();
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

  const createAPIKeyModal = ModalsV2.useModal(ModalsV2.Workspace.CreateAPIKey);

  const [apiKeys, setAPIKeys] = React.useState<APIKey[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAPIKeys = React.useCallback(async () => {
    try {
      const keys = await (isIdentityWorkspaceEnabled
        ? client.identity.apiKey.listWorkspaceApiKeys(workspaceID)
        : client.workspace.listAPIKeys(workspaceID));

      setAPIKeys(keys);
    } catch (error) {
      Sentry.error(error);
      toast.error(getErrorMessage(error));
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
          body: 'Are you sure you want to delete this API key? Any services consuming this key will fail.',
          bodyStyle: { padding: '16px', textAlign: 'center' },
          modalProps: { centered: true, withHeader: false, maxWidth: 300 },
          footerStyle: { justifyContent: 'space-between' },

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
      <Settings.Section title="API Keys">
        <Settings.Card>
          <Box.FlexCenter pt={20}>
            <Spinner isMd />
          </Box.FlexCenter>
        </Settings.Card>
      </Settings.Section>
    );
  }

  return (
    <Settings.Section title="API Keys">
      <Settings.Card>
        <Box.FlexApart px={32} py={24}>
          <Text color="secondary">({apiKeys.length}) Existing API Keys</Text>

          <ClickableText onClick={() => createAPIKeyModal.openVoid({ workspaceID, onCreate: fetchAPIKeys })}>Create New API Key</ClickableText>
        </Box.FlexApart>

        {!!apiKeys.length && (
          <TableContainer topBorder columns={[1]}>
            {apiKeys.map(({ _id: keyID, name }, index) => (
              <TableRow key={keyID} hasBorder={index + 1 !== apiKeys.length}>
                <Box py={16}>
                  {name}
                  <Box color="secondary" mt={6}>{`VF.${keyID}.XXX...`}</Box>
                </Box>

                <Dropdown options={[{ label: 'Delete', onClick: confirmDeleteKey(keyID) }]} placement="bottom-end">
                  {(ref, onToggle, isOpen) => (
                    <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                  )}
                </Dropdown>
              </TableRow>
            ))}
          </TableContainer>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default APIKeyPage;
