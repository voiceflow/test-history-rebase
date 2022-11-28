import { BlockText, Box, BoxFlex, Button, ButtonVariant, FullSpinner, Link, SvgIcon, Text, ThemeColor, toast, useToggle } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/CodePreview/Samples';
import { ConfirmProps } from '@/components/ConfirmModal';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useModals, usePermissions, useSetup, useTrackingEvents } from '@/hooks';
import { ProjectAPIKey } from '@/models';
import { copy } from '@/utils/clipboard';

import { ContentContainer, ContentSection, FlatCard, Section } from '../components';
import ProjectAPIKeySection from './components/section';
import StyledButton from './components/StyledButton';
import { getSamples } from './utils';

const API: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [primaryKey, setPrimaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [secondaryKey, setSecondaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [showPrimaryKey, togglePrimaryKey] = useToggle(false);
  const [showSecondaryKey, toggleSecondaryKey] = useToggle(false);

  const hasPermissions = usePermissions([Permission.API_KEY_EDIT, Permission.API_KEY_VIEW]);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const confirmModal = useModals<ConfirmProps>(ModalType.CONFIRM);

  const samples = getSamples(GENERAL_RUNTIME_ENDPOINT, showSecondaryKey || showPrimaryKey ? secondaryKey?.key ?? primaryKey?.key : '');

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  useAsyncEffect(async () => {
    if (hasPermissions) {
      setLoading(true);
      const apiKeys = await client.project.listAPIKeys(projectID);

      // TODO maybe refactor, tiny bit ugly
      let fetchedApiKey: ProjectAPIKey | null = null;
      if (apiKeys.length > 0) {
        // first look for key that has secondaryKeyID property
        fetchedApiKey = apiKeys.find((key) => key?.secondaryKeyID !== undefined) ?? apiKeys[0];
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
  }, [hasPermissions, projectID]);

  const createSecondaryKey = async () => {
    const fetchedSecondaryKey = await client.project.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
    setSecondaryKey(fetchedSecondaryKey);
    toast.success('Secondary key created.');
  };

  const deleteSecondaryKey = async () => {
    confirmModal.open({
      body: 'This action will remove the secondary API key entirely. Are you sure you want to continue?',
      header: 'Remove API Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        await client.project.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

        setSecondaryKey(null);

        toast.success('Secondary key removed.');
      },
    });
  };

  const promoteSecondaryKey = async () => {
    confirmModal.open({
      body: 'This action will replace your current primary key. Are you sure you want to continue?',
      header: 'Promote API Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        await client.project.promoteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

        setPrimaryKey(secondaryKey);
        setSecondaryKey(null);

        toast.success('Key successfully promoted.');
      },
    });
  };

  const regeneratePrimaryKey = async () => {
    confirmModal.open({
      body: 'This action will remove the current primary key and replace it with a new one. Are you sure you want to continue?',
      header: 'Regenerate Primary Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        const regeneratedPrimaryKey = await client.project.regeneratePrimaryAPIKey({ apiKey: primaryKey!._id, projectID });

        setPrimaryKey(regeneratedPrimaryKey);

        toast.success('Primary key regenerated.');
      },
    });
  };

  const regenerateSecondaryKey = async () => {
    confirmModal.open({
      body: 'This action will remove the current secondary key and replace it with a new one. Are you sure you want to continue?',
      header: 'Regenerate Secondary Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        const regeneratedSecondaryKey = await client.project.regenerateSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

        setSecondaryKey(regeneratedSecondaryKey);

        toast.success('Secondary key regenerated.');
      },
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

        {hasPermissions && (
          <>
            <ProjectAPIKeySection
              title="Primary Key"
              apiKey={primaryKey}
              show={showPrimaryKey}
              onToggleShow={togglePrimaryKey}
              options={[
                {
                  label: 'Regenerate key',
                  onClick: () => regeneratePrimaryKey(),
                },
                ...(!secondaryKey
                  ? [
                      {
                        label: 'Create secondary key',
                        onClick: () => createSecondaryKey(),
                      },
                    ]
                  : []),
              ]}
            >
              {primaryKey && (
                <Button onClick={() => copyKey(primaryKey.key)} variant={ButtonVariant.PRIMARY}>
                  Copy API Key
                </Button>
              )}
            </ProjectAPIKeySection>

            {!!secondaryKey && (
              <ProjectAPIKeySection
                title="Secondary Key"
                apiKey={secondaryKey}
                show={showSecondaryKey}
                onToggleShow={toggleSecondaryKey}
                options={[
                  {
                    label: 'Regenerate key',
                    onClick: () => regenerateSecondaryKey(),
                  },
                  {
                    label: 'Remove secondary key',
                    onClick: () => deleteSecondaryKey(),
                  },
                ]}
              >
                {secondaryKey && (
                  <StyledButton onClick={promoteSecondaryKey} variant={ButtonVariant.SECONDARY} style={{ whiteSpace: 'nowrap' }}>
                    Promote Key
                  </StyledButton>
                )}
              </ProjectAPIKeySection>
            )}
          </>
        )}

        <ContentSection>
          <Section title="API Call Examples" card={false}>
            <SampleEditor samples={samples} />
          </Section>
        </ContentSection>
      </ContentContainer>
    </>
  );
};

export default API;
