import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, Link, Toggle } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as Settings from '@/components/Settings';
import { AI_GENERAL_LINK } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { useConfirmModal } from '@/ModalsV2/hooks';
import { openURLInANewTab } from '@/utils/window';

// only show if workspace is enterprise
const AiAssistSection: React.FC = () => {
  const { isEnabled: isAssistantAiEnabled } = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace();
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);

  const toggleAiAssist = useDispatch(WorkspaceV2.toggleActiveWorkspaceAiAssist);
  const [trackingEvents] = useTrackingEvents();

  const confirmModal = useConfirmModal();

  const handleToggle = (enabled: boolean) => {
    toggleAiAssist(enabled);
    trackingEvents.trackWorkspaceAIFeatureToggled({ enabled });
  };

  const confirmToggle = () => {
    const enabled = !workspace?.settings?.aiAssist;

    if (enabled) return handleToggle(enabled);

    confirmModal.open({
      header: 'Disable AI Assistant',
      confirm: () => handleToggle(enabled),
      confirmButtonText: 'Confirm',
      body: 'This action will permanently remove AI features from all existing projects and prevent new projects from using AI features.',
    });
  };

  if (!isAssistantAiEnabled || !isEnterprise) return null;

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>
            Voiceflow AI Assistants <Badge.Descriptive marginLeft={9}>Beta</Badge.Descriptive>
          </Page.Section.Title>
          <Page.Section.Description>
            {' '}
            <>
              Leverage practical AI to design, manage and improve your assistants faster than previously possible.{' '}
              <Link onClick={() => openURLInANewTab(AI_GENERAL_LINK)}>Learn more</Link>
            </>
          </Page.Section.Description>
        </Page.Section.Header>
      }
    >
      <Settings.SubSection contentProps={{ topOffset: 3 }} splitView>
        <Box.FlexApart fullWidth>
          <div>
            <Settings.SubSection.Title>Voiceflow AI Assistants</Settings.SubSection.Title>

            <Settings.SubSection.Description>Enable or disable workspace members to access AI Assistant features.</Settings.SubSection.Description>
          </div>

          <Toggle checked={!!workspace?.settings?.aiAssist} size={Toggle.Size.EXTRA_SMALL} onChange={confirmToggle} hasLabel />
        </Box.FlexApart>
      </Settings.SubSection>
    </Page.Section>
  );
};

export default AiAssistSection;
