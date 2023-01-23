import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { AI_GENERAL_LINK } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useFeature, useTrackingEvents } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

const AIAssistSection: React.FC = () => {
  const { isEnabled: isAssistantAiEnabled } = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace();
  const toggleAiAssist = useDispatch(Workspace.toggleActiveWorkspaceAiAssist);
  const [trackingEvents] = useTrackingEvents();

  const handleToggle = () => {
    const enabled = !workspace?.settings?.aiAssist;

    toggleAiAssist(enabled);

    trackingEvents.trackWorkspaceAIFeatureToggled({ enabled });
  };

  if (!isAssistantAiEnabled) return null;

  return (
    <Settings.Section
      title={
        <Box.Flex>
          Voiceflow AI Assist <Settings.Badge>Beta</Settings.Badge>
        </Box.Flex>
      }
      description={
        <>
          Leverage practical AI to design, manage and improve your assistants faster than previously possible.{' '}
          <Link onClick={() => openURLInANewTab(AI_GENERAL_LINK)}>Learn more</Link>
        </>
      }
    >
      <Settings.Card>
        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart fullWidth>
            <div>
              <Settings.SubSection.Title>Voiceflow AI Assist</Settings.SubSection.Title>

              <Settings.SubSection.Description>Enable or disable workspace members to access AI Assist features.</Settings.SubSection.Description>
            </div>

            <Toggle checked={!!workspace?.settings?.aiAssist} size={Toggle.Size.EXTRA_SMALL} onChange={handleToggle} hasLabel />
          </Box.FlexApart>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default AIAssistSection;
