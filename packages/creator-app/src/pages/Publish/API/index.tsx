import {
  BlockText,
  Box,
  BoxFlex,
  Button,
  ButtonVariant,
  FullSpinner,
  Label,
  Link,
  SvgIcon,
  Text,
  ThemeColor,
  TippyTooltip,
  toast,
  useToggle,
} from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/AceEditor/Sample';
import { ConfirmProps } from '@/components/ConfirmModal';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useIsAdmin, useModals, useSetup, useTrackingEvents } from '@/hooks';
import { ProjectAPIKey } from '@/models';
import { copy } from '@/utils/clipboard';

import { ContentContainer, ContentSection, FlatCard, Section } from '../components';
import ProjectAPIKeyInput from './components/input';
import { getSamples } from './utils';

const API: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [primaryKey, setPrimaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [secondaryKey, setSecondaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [showPrimaryKey, togglePrimaryKey] = useToggle(false);
  const [showSecondaryKey, toggleSecondaryKey] = useToggle(false);

  const isAdmin = useIsAdmin();

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const { open: openConfirmPromoteModal } = useModals<ConfirmProps>(ModalType.CONFIRM);
  const { open: openConfirmDeleteModal } = useModals<ConfirmProps>(ModalType.CONFIRM);

  const samples = getSamples(showSecondaryKey || showPrimaryKey ? secondaryKey?.key ?? primaryKey?.key : '');

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  useAsyncEffect(async () => {
    if (isAdmin) {
      setLoading(true);
      const apiKeys = await client.project.listAPIKeys(projectID);

      // TODO maybe refactor, tiny bit ugly
      let fetchedApiKey: ProjectAPIKey | null = null;
      if (apiKeys.length > 0) {
        [fetchedApiKey] = apiKeys;
      } else {
        const apiKey = await client.project.createAPIKey({ workspaceID, projectID });
        fetchedApiKey = apiKey;
      }
      setPrimaryKey(fetchedApiKey);

      // find secondary key
      const fetchedSecondaryKey = apiKeys.filter((key) => key.secondaryKeyID !== null).find((key) => fetchedApiKey!.secondaryKeyID === key._id);
      setSecondaryKey(fetchedSecondaryKey || null);
    }

    setLoading(false);
  }, [isAdmin, projectID]);

  const createSecondaryKey = async () => {
    const fetchedSecondaryKey = await client.project.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
    setSecondaryKey(fetchedSecondaryKey);
  };

  const deleteSecondaryKey = async () => {
    openConfirmDeleteModal({
      header: 'Delete Secondary API Key',
      body: (
        <Box>
          <BlockText>
            <span>Your Secondary Key will be removed and will no longer be usable.</span>
          </BlockText>
          <BlockText mt={12}>
            <p>This action cannot be undone.</p>
          </BlockText>
        </Box>
      ),
      confirm: async () => {
        await client.project.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        setSecondaryKey(null);
      },
      canCancel: true,
    });
  };

  const promoteSecondaryKey = async () => {
    openConfirmPromoteModal({
      header: 'Promote Secondary API Key',
      body: (
        <Box>
          <BlockText>
            <span>Your Primary Key will be removed, and your Secondary Key will become the new Primary Key.</span>
          </BlockText>
          <BlockText mt={12}>
            <p>This action cannot be undone.</p>
          </BlockText>
        </Box>
      ),
      confirm: async () => {
        await client.project.promoteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        setPrimaryKey(secondaryKey);
        setSecondaryKey(null);
      },
      canCancel: true,
    });
  };

  const copyKey = (key: string) => {
    copy(key);
    toast.success('Copied API Key');
  };

  if (loading) {
    return <FullSpinner />;
  }

  return (
    <>
      <ContentContainer>
        <ContentSection>
          <FlatCard m={12}>
            <BoxFlex justifyContent="flex-end">
              <SvgIcon size={64} icon="globe" />
              <Box ml={24}>
                <BlockText fontWeight={600} mb={8} color={ThemeColor.PRIMARY}>
                  API Documentation
                </BlockText>
                <Text>
                  Integrate your Voiceflow project with any conversational interface like a chatbot, voice assistant, IVR, web chat, and much more.{' '}
                  <Link href={DIALOG_MANAGER_API}>See documentation</Link>
                </Text>
              </Box>
            </BoxFlex>
          </FlatCard>
        </ContentSection>

        {isAdmin && (
          <ContentSection>
            <Section title="Dialog API Key">
              <Label>Primary Key</Label>
              {!!primaryKey && <ProjectAPIKeyInput value={primaryKey.key} show={showPrimaryKey} onCopy={copyKey} onToggleShow={togglePrimaryKey} />}

              {!secondaryKey ? (
                <BoxFlex>
                  <Button onClick={createSecondaryKey} variant={ButtonVariant.SECONDARY} squareRadius>
                    Create Secondary Key
                  </Button>
                  <TippyTooltip title="A secondary key can be used to rotate the active key.">
                    <Box ml={8}>
                      <SvgIcon icon="info" size={16} color="#6E849A" />
                    </Box>
                  </TippyTooltip>
                </BoxFlex>
              ) : (
                <>
                  <Label>Secondary Key</Label>
                  <ProjectAPIKeyInput value={secondaryKey.key} show={showSecondaryKey} onCopy={copyKey} onToggleShow={toggleSecondaryKey}>
                    <Box ml={12}>
                      <Button onClick={promoteSecondaryKey} variant={ButtonVariant.PRIMARY} squareRadius>
                        Promote
                      </Button>
                    </Box>
                    <Box ml={12}>
                      <Button onClick={deleteSecondaryKey} variant={ButtonVariant.SECONDARY} squareRadius>
                        Delete
                      </Button>
                    </Box>
                  </ProjectAPIKeyInput>
                </>
              )}

              <Box mt={12}>
                <Text fontSize={13}>
                  <SvgIcon icon="warning" inline mb={-3} mr={10} />
                  Always store your key securely to protect your account.
                </Text>
              </Box>
            </Section>
          </ContentSection>
        )}

        <ContentSection>
          <Section title="API Call Examples" card={false}>
            <SampleEditor samples={samples} wrap={false} />
          </Section>
        </ContentSection>
      </ContentContainer>
    </>
  );
};

export default API;
