import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as Settings from '@/components/Settings';
import { Permission } from '@/constants/permissions';
import * as Session from '@/ducks/session';
import { useAsyncEffect, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';
import { useConfirmModal } from '@/hooks/modal.hook';
import type { ProjectAPIKey } from '@/models';
import { copy } from '@/utils/clipboard';

import ProjectAPIKeySection from '../components/ProjectAPIKeySection';

export interface KeyState {
  primaryKey: ProjectAPIKey | null;
  secondaryKey: ProjectAPIKey | null;
  showPrimaryKey: boolean;
  showSecondaryKey: boolean;
}

interface KeySectionProps {
  page: string;
  syncKeyState?: (state: KeyState) => void;
}

const KeySection: React.FC<KeySectionProps> = ({ syncKeyState, page }) => {
  const identityAPIKey = useFeature(Realtime.FeatureFlag.IDENTITY_API_KEY);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  const [loading, setLoading] = React.useState(true);
  const [keyState, _setKeyState] = React.useState<KeyState>({
    primaryKey: null,
    secondaryKey: null,
    showPrimaryKey: false,
    showSecondaryKey: false,
  });

  const updateKeyState = React.useCallback(
    (state: Partial<KeyState>) =>
      _setKeyState((prev) => {
        const nextState = { ...prev, ...state };
        syncKeyState?.(nextState);
        return nextState;
      }),
    []
  );

  const { primaryKey, secondaryKey, showPrimaryKey, showSecondaryKey } = keyState;

  const [canEditAPIKey] = usePermission(Permission.API_KEY_UPDATE);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const confirmModal = useConfirmModal();

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage({ page });
  });

  useAsyncEffect(async () => {
    if (!canEditAPIKey && !viewerAPIKeyAccess) return;

    setLoading(true);

    const apiKeys = identityAPIKey
      ? await client.identity.apiKey.listAPIKeys(projectID)
      : await client.project.listAPIKeys(projectID);

    // TODO maybe refactor, tiny bit ugly
    let fetchedApiKey: ProjectAPIKey | null = null;

    if (apiKeys.length > 0) {
      // first look for key that has secondaryKeyID property
      fetchedApiKey = apiKeys.find((key) => key?.secondaryKeyID !== undefined) ?? apiKeys[0];
    } else if (canEditAPIKey) {
      const apiKey = identityAPIKey
        ? await client.identity.apiKey.createAPIKey({ projectID })
        : await client.project.createAPIKey({ projectID, workspaceID });

      fetchedApiKey = apiKey;
    } else {
      toast.warn('No active api key.');
    }

    // find secondary key
    const fetchedSecondaryKey = apiKeys
      .filter((key) => key.secondaryKeyID !== null)
      .find((key) => fetchedApiKey!.secondaryKeyID === key._id);

    updateKeyState({ primaryKey: fetchedApiKey, secondaryKey: fetchedSecondaryKey || null });

    setLoading(false);
  }, [projectID, viewerAPIKeyAccess, canEditAPIKey]);

  const createSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    const fetchedSecondaryKey = identityAPIKey
      ? await client.identity.apiKey.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id })
      : await client.project.createSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

    updateKeyState({ secondaryKey: fetchedSecondaryKey });

    toast.success('Secondary key created.');
  };

  const deleteSecondaryKey = async () => {
    if (!canEditAPIKey) return;

    confirmModal.open({
      body: 'This action will remove the secondary API key entirely. Are you sure you want to continue?',
      header: 'Remove API Key',
      confirmButtonText: 'Continue',

      confirm: async () => {
        if (identityAPIKey) {
          await client.identity.apiKey.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        } else {
          await client.project.deleteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        }

        updateKeyState({ showSecondaryKey: false, secondaryKey: null });

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
        if (identityAPIKey) {
          await client.identity.apiKey.promoteSecondaryAPIKey({ projectID });
        } else {
          await client.project.promoteSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });
        }

        updateKeyState({ primaryKey: secondaryKey, secondaryKey: null });

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
        const regeneratedPrimaryKey = identityAPIKey
          ? await client.identity.apiKey.regenerateAPIKey({ apiKey: primaryKey!._id, projectID })
          : await client.project.regeneratePrimaryAPIKey({ projectID, apiKey: primaryKey!._id });

        updateKeyState({ primaryKey: regeneratedPrimaryKey });

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
        const regeneratedSecondaryKey = identityAPIKey
          ? await client.identity.apiKey.regenerateAPIKey({ projectID, apiKey: secondaryKey!._id })
          : await client.project.regenerateSecondaryAPIKey({ projectID, apiKey: primaryKey!._id });

        updateKeyState({ secondaryKey: regeneratedSecondaryKey });

        toast.success('Secondary key regenerated.');
      },
    });
  };

  const copyKey = (key: string) => {
    copy(key);
    toast.success('Copied API Key');
    trackingEvents.trackProjectAPIKeyCopied({ page });
  };

  if (!canEditAPIKey && !viewerAPIKeyAccess) return null;

  return (
    <Settings.Section title="Keys">
      <Settings.Card>
        <ProjectAPIKeySection
          show={showPrimaryKey}
          title="Primary Key"
          apiKey={primaryKey}
          loading={loading}
          onToggleShow={() => updateKeyState({ showPrimaryKey: !showPrimaryKey })}
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
              onToggleShow={() => updateKeyState({ showSecondaryKey: !showSecondaryKey })}
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
  );
};

export default KeySection;
