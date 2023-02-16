import { datadogRum } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Dropdown, Link, Spinner, System, toast } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import { TableContainer, TableRow } from '@/components/Table';
import * as Feature from '@/ducks/feature';
import { setConfirm } from '@/ducks/modal';
import * as Session from '@/ducks/session';
import * as ModalsV2 from '@/ModalsV2';
import { APIKey } from '@/models';
import { getErrorMessage } from '@/utils/error';

import { Description, SectionWrapper, Title } from './styles';

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
      datadogRum.addError(error);
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
      <SectionWrapper>
        <Spinner isMd />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Box.FlexApart width={700}>
        <Box.FlexAlignStart flexDirection="column">
          <Title>Workspace API Keys</Title>
          <Description>
            Read and write to your Voiceflow assistant files.
            <Link paddingLeft="3px">Learn more</Link>
          </Description>
        </Box.FlexAlignStart>
        <Button
          variant={Button.Variant.PRIMARY}
          onClick={() =>
            createAPIKeyModal.openVoid({
              workspaceID,
              onCreate: fetchAPIKeys,
            })
          }
        >
          Create Key
        </Button>
      </Box.FlexApart>
      {!!apiKeys.length && (
        <Box width={700} pt={16}>
          <TableContainer topBorder columns={[1]} allBorders>
            {apiKeys.map(({ _id: keyID, name }, index) => (
              <TableRow key={keyID} hasBorder={index !== apiKeys.length - 1}>
                <Box py={16}>
                  {name}
                  <Box color="secondary" mt={6}>{`VF.${keyID}.XXX...`}</Box>
                </Box>

                <Dropdown options={[{ label: 'Delete', onClick: confirmDeleteKey(keyID) }]} placement="bottom-end">
                  {({ ref, onToggle, isOpen }) => (
                    <System.IconButton.Base
                      ref={ref}
                      size={System.IconButton.Size.L}
                      icon="ellipsis"
                      active={isOpen}
                      onClick={onToggle}
                      iconProps={{ size: 15 }}
                    />
                  )}
                </Dropdown>
              </TableRow>
            ))}
          </TableContainer>
        </Box>
      )}
    </SectionWrapper>
  );
};

export default APIKeyPage;
