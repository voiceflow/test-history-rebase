import * as Realtime from '@voiceflow/realtime-sdk';
import { Banner, Box, Button, SectionV2, SvgIcon, TippyTooltip, toast, useToggle } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/CodePreview/Samples';
import * as Settings from '@/components/Settings';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { Permission } from '@/constants/permissions';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useFeature, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { useConfirmModal } from '@/ModalsV2/hooks';
import { ProjectAPIKey } from '@/models';
import { copy } from '@/utils/clipboard';
import { openURLInANewTab } from '@/utils/window';

import ProjectAPIKeySection from '../components/ProjectAPIKeySection';
import { getSamples } from './utils';

const API: React.FC = () => {
  const disableAPIKey = useFeature(Realtime.FeatureFlag.DISABLE_API_KEY);
  const identityAPIKey = useFeature(Realtime.FeatureFlag.IDENTITY_API_KEY);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  const [loading, setLoading] = React.useState(true);
  const [primaryKey, setPrimaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [secondaryKey, setSecondaryKey] = React.useState<ProjectAPIKey | null>(null);
  const [showPrimaryKey, togglePrimaryKey] = useToggle(false);
  const [showSecondaryKey, toggleSecondaryKey] = useToggle(false);

  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const confirmModal = useConfirmModal();

  const samples = getSamples(GENERAL_RUNTIME_ENDPOINT, showSecondaryKey || showPrimaryKey ? secondaryKey?.key ?? primaryKey?.key : '');

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  useAsyncEffect(async () => {
    if (!canEditAPIKey && !viewerAPIKeyAccess.isEnabled) return;

    setLoading(true);

    const apiKeys = identityAPIKey.isEnabled ? await client.identity.apiKey.listAPIKeys(projectID) : await client.project.listAPIKeys(projectID);

    // TODO maybe refactor, tiny bit ugly
    let fetchedApiKey: ProjectAPIKey | null = null;

    if (apiKeys.length > 0) {
      // first look for key that has secondaryKeyID property
      fetchedApiKey = apiKeys.find((key) => key?.secondaryKeyID !== undefined) ?? apiKeys[0];
    } else if (canEditAPIKey) {
      const apiKey = identityAPIKey.isEnabled
        ? await client.identity.apiKey.createAPIKey({ projectID })
        : await client.project.createAPIKey({ projectID, workspaceID });

      fetchedApiKey = apiKey;
    } else {
      toast.warn('No active api key.');
    }

    setPrimaryKey(fetchedApiKey);

    // find secondary key
    const fetchedSecondaryKey = apiKeys.filter((key) => key.secondaryKeyID !== null).find((key) => fetchedApiKey!.secondaryKeyID === key._id);

    setSecondaryKey(fetchedSecondaryKey || null);

    setLoading(false);
  }, [projectID, viewerAPIKeyAccess.isEnabled, canEditAPIKey]);

  const createSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    const fetchedSecondaryKey = identityAPIKey.isEnabled
      ? await client.identity.apiKey.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id })
      : await client.project.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

    setSecondaryKey(fetchedSecondaryKey);

    toast.success('Secondary key created.');
  };

  const deleteSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    confirmModal.open({
      body: 'This action will remove the secondary API key entirely. Are you sure you want to continue?',
      header: 'Remove API Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        if (identityAPIKey.isEnabled) {
          await client.identity.apiKey.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        } else {
          await client.project.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        }

        setSecondaryKey(null);

        toast.success('Secondary key removed.');
      },
    });
  };

  const promoteSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    confirmModal.open({
      body: 'This action will replace your current primary key. Are you sure you want to continue?',
      header: 'Promote API Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        if (identityAPIKey.isEnabled) {
          await client.identity.apiKey.promoteSecondaryAPIKey({ projectID });
        } else {
          await client.project.promoteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        }

        setPrimaryKey(secondaryKey);
        setSecondaryKey(null);

        toast.success('Key successfully promoted.');
      },
    });
  };

  const regeneratePrimaryKey = async () => {
    if (!canEditAPIKey) return;

    confirmModal.open({
      body: 'This action will remove the current primary key and replace it with a new one. Are you sure you want to continue?',
      header: 'Regenerate Primary Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        const regeneratedPrimaryKey = identityAPIKey.isEnabled
          ? await client.identity.apiKey.regenerateAPIKey({ apiKey: primaryKey!._id, projectID })
          : await client.project.regeneratePrimaryAPIKey({ projectID, apiKey: primaryKey!._id });

        setPrimaryKey(regeneratedPrimaryKey);

        toast.success('Primary key regenerated.');
      },
    });
  };

  const regenerateSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    confirmModal.open({
      body: 'This action will remove the current secondary key and replace it with a new one. Are you sure you want to continue?',
      header: 'Regenerate Secondary Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        const regeneratedSecondaryKey = identityAPIKey.isEnabled
          ? await client.identity.apiKey.regenerateAPIKey({ projectID, apiKey: secondaryKey!._id })
          : await client.project.regenerateSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

        setSecondaryKey(regeneratedSecondaryKey);

        toast.success('Secondary key regenerated.');
      },
    });
  };

  const copyKey = (key: string) => {
    copy(key);
    toast.success('Copied API Key');
  };

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Export your assistant data via API"
          onClick={() => openURLInANewTab('https://developer.voiceflow.com/docs/exports')}
          subtitle="Convert your Assistant data into the format required for your NLU."
          buttonText="See Usecases"
        />
      </Settings.Section>

      {(canEditAPIKey || viewerAPIKeyAccess.isEnabled) && !disableAPIKey.isEnabled && (
        <Settings.Section
          title={
            <Box.Flex>
              <Box>Keys</Box>
              <Box ml={5} mt={2}>
                <TippyTooltip width={270} content="Regenerating API keys affects the Project API and Dialog Manager API.">
                  <SvgIcon mt={10} icon="info" variant={SvgIcon.Variant.STANDARD} />
                </TippyTooltip>
              </Box>
            </Box.Flex>
          }
        >
          <Settings.Card>
            <ProjectAPIKeySection
              show={showPrimaryKey}
              title="Primary Key"
              apiKey={primaryKey}
              loading={loading}
              onToggleShow={togglePrimaryKey}
              options={
                canEditAPIKey
                  ? [
                      { label: 'Regenerate key', onClick: () => regeneratePrimaryKey() },
                      secondaryKey ? null : { label: 'Create secondary key', onClick: () => createSecondaryKey() },
                    ]
                  : []
              }
            >
              {(primaryKey || loading) && (
                <Button
                  width={134}
                  small
                  nowrap
                  onClick={() => primaryKey && copyKey(primaryKey.key)}
                  variant={Button.Variant.SECONDARY}
                  disabled={loading}
                  isLoading={loading}
                >
                  Copy API Key
                </Button>
              )}
            </ProjectAPIKeySection>

            {!!secondaryKey && (
              <>
                <SectionV2.Divider />

                <ProjectAPIKeySection
                  show={showSecondaryKey}
                  title="Secondary Key"
                  apiKey={secondaryKey}
                  loading={loading}
                  onToggleShow={toggleSecondaryKey}
                  options={
                    canEditAPIKey
                      ? [
                          { label: 'Regenerate key', onClick: () => regenerateSecondaryKey() },
                          { label: 'Remove secondary key', onClick: () => deleteSecondaryKey() },
                        ]
                      : []
                  }
                >
                  {(secondaryKey || loading) && (
                    <Button
                      width={134}
                      small
                      nowrap
                      onClick={promoteSecondaryKey}
                      variant={Button.Variant.SECONDARY}
                      disabled={loading}
                      isLoading={loading}
                    >
                      Promote Key
                    </Button>
                  )}
                </ProjectAPIKeySection>
              </>
            )}
          </Settings.Card>
        </Settings.Section>
      )}

      <Settings.Section title="API Call Examples">
        <SampleEditor samples={samples} />
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default API;
