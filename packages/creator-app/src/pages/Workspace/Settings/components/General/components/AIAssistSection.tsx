import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, SectionV2, Toggle } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection, SettingsTitleBadge } from '@/components/Settings';
import { AI_GENERAL_LINK } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useFeature, useTrackingEvents } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

const AIAssistSection: React.FC = () => {
  const { isEnabled: isAssistantAiEnabled } = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace()!;
  const toggleAiAssist = useDispatch(Workspace.toggleActiveWorkspaceAiAssist);
  const [trackingEvents] = useTrackingEvents();

  const handleToggle = () => {
    const enabled = !workspace.settings?.aiAssist;

    toggleAiAssist(enabled);

    trackingEvents.trackWorkspaceAIFeatureToggled({ enabled });
  };

  if (!isAssistantAiEnabled) return null;

  return (
    <SettingsSection
      title={
        <Box.Flex>
          Voiceflow AI Assist <SettingsTitleBadge>Beta</SettingsTitleBadge>
        </Box.Flex>
      }
      variant={SectionVariants.PRIMARY}
      noContentPadding
      description={
        <>
          Leverage practical AI to design, manage and improve your assistants faster than previously possible.{' '}
          <Link onClick={() => openURLInANewTab(AI_GENERAL_LINK)}>Learn more</Link>
        </>
      }
    >
      <SettingsSubSection growInput={false} topOffset={3}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>Voiceflow AI Assist</SectionV2.Title>

            <SectionV2.Description mt={4} block secondary>
              Enable or disable workspace members to access AI Assist features.
            </SectionV2.Description>
          </div>

          <Toggle checked={!!workspace.settings?.aiAssist} size={Toggle.Size.EXTRA_SMALL} onChange={handleToggle} hasLabel />
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default AIAssistSection;
