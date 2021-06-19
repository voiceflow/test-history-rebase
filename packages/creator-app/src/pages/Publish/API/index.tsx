import { APIKey } from '@voiceflow/api-sdk';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/AceEditor/Sample';
import Box, { Flex } from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import { FullSpinner } from '@/components/Spinner';
import Text, { BlockText, Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import { goToWorkspaceDeveloperSettings } from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useDispatch, useIsAdmin, useModals } from '@/hooks';
import CreateAPIKeyModal from '@/pages/Workspace/Settings/components/Developer/modal';
import * as Sentry from '@/vendors/sentry';

import { ContentContainer, ContentSection } from '../components';
import Section from '../components/Section';
import { getSamples } from './utils';

const AdminMessage = 'Only workspace admins can manage API Keys';

const API: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [keys, setKeys] = React.useState<APIKey[]>([]);
  const [activeKey, setActiveKey] = React.useState('');

  const isAdmin = useIsAdmin();

  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const projectName = useSelector(Project.activeProjectNameSelector)!;

  const samples = getSamples(versionID, activeKey);

  const { open: openCreateModal, isOpened } = useModals(ModalType.API_KEY_CREATE);
  const { open: openConfirmModal } = useModals(ModalType.CONFIRM);

  const goToDeveloperSettings = useDispatch(() => goToWorkspaceDeveloperSettings(workspaceID));

  const projectKeys = React.useMemo(() => keys.filter((key) => key.projectID === projectID), [keys, projectID]);

  useAsyncEffect(async () => {
    if (isAdmin) {
      setKeys(await client.workspace.listAPIKeys(workspaceID));
    }
    setLoading(false);
  }, [activeKey, workspaceID, isAdmin, projectID]);

  if (loading) {
    return <FullSpinner />;
  }

  const createNewKey = () =>
    openCreateModal({
      projectID,
      workspaceID,
      onCreate: setActiveKey,
      name: `${projectName}-${Date.now()}-API-KEY`,
    });

  const confirmRefresh = () =>
    openConfirmModal({
      header: 'Refresh API Key',
      body: (
        <Box textAlign="left">
          Your current API Key for this project will stop working. <b>Are you sure you want to continue?</b>
        </Box>
      ),
      confirm: async () => {
        await Promise.all(projectKeys.map((key) => client.api.apiKey.delete(key._id))).catch(Sentry.error);
        createNewKey();
      },
    });

  return (
    <>
      <CreateAPIKeyModal />
      <ContentContainer>
        <ContentSection>
          <Section title="API Call Examples" card={false}>
            <SampleEditor samples={samples} />
          </Section>
        </ContentSection>
        <ContentSection>
          <Section title="API Keys">
            <BlockText fontWeight={600} mb={8}>
              Manage Keys
            </BlockText>
            <Text>Manage and edit all API keys created across projects in this workspace.</Text>
            <Flex justifyContent="flex-end" mt={24}>
              <Tooltip title={AdminMessage} disabled={isAdmin}>
                <Button variant={ButtonVariant.QUATERNARY} onClick={goToDeveloperSettings} disabled={!isAdmin}>
                  Manage Keys {!!keys.length && `(${keys.length})`}
                </Button>
              </Tooltip>
            </Flex>
          </Section>
          <Section>
            <BlockText fontWeight={600} mb={8}>
              Create API Key
            </BlockText>
            <Text>This key allows you to make requests to our Dialog Management API.</Text>
            <Flex justifyContent="flex-end" mt={24}>
              <Tooltip title={AdminMessage} disabled={isAdmin}>
                <Button onClick={projectKeys.length ? confirmRefresh : createNewKey} disabled={!isAdmin || isOpened}>
                  {projectKeys.length ? 'Refresh Key' : 'Create Key'}
                </Button>
              </Tooltip>
            </Flex>
          </Section>
        </ContentSection>
        <ContentSection>
          <Section title="API Documentation">
            <BlockText fontWeight={600} mb={8}>
              Dialog Management API
            </BlockText>
            <Text>
              Allow your Voiceflow project to be easily integrated into any conversational interface like a chatbot, voice assistant, IVR, web chat,
              and so much more.
            </Text>
            <Flex justifyContent="flex-end" mt={12}>
              <Link href={DIALOG_MANAGER_API}>Learn More</Link>
            </Flex>
          </Section>
        </ContentSection>
      </ContentContainer>
    </>
  );
};

export default API;
