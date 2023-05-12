import { BaseModels } from '@voiceflow/base-types';
import { Badge, Box, System, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import { useProjectAIPlayground } from '@/components/GPT/hooks';
import * as Settings from '@/components/Settings';
import { AI_GENERAL_LINK, LEARN_KNOWLEDGE_BASE } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { SettingSections } from '@/pages/Settings/constants';

import { useAutoScrollSectionIntoView } from '../hooks';
import { WorkspaceDisabledTooltip } from './components';

const AIAssistant: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();

  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);

  const updateProjectAiAssistSettings = useDispatch(Project.updateProjectAiAssistSettings);

  const projectAIPlaygroundEnabled = useProjectAIPlayground();

  const onPatchAiAssistSettings = (settings: Partial<BaseModels.Project.AIAssistSettings>) => {
    if (!activeProjectID) return;

    updateProjectAiAssistSettings(activeProjectID, { ...aiAssistSettings, ...settings });
  };

  const onGenerateNoMatchToggle = async () => {
    const generateNoMatchEnabled = aiAssistSettings?.generateNoMatch;

    onPatchAiAssistSettings({ generateNoMatch: !generateNoMatchEnabled });
    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled: !generateNoMatchEnabled, flag: GPT.FeatureToggle.GENERATE_NO_MATCH });
  };

  const [sectionRef] = useAutoScrollSectionIntoView(SettingSections.AI_ASSISTANT);

  if (!projectAIPlaygroundEnabled) {
    return null;
  }

  return (
    <Settings.Section
      ref={sectionRef}
      title={
        <Box.Flex>
          Voiceflow AI Features <Badge.Descriptive marginLeft={9}>Beta</Badge.Descriptive>
        </Box.Flex>
      }
      description={
        <>
          Leverage practical AI to design, manage and improve your assistant faster than previously possible.{' '}
          <System.Link.Anchor href={AI_GENERAL_LINK}>Learn more</System.Link.Anchor>
        </>
      }
    >
      <Settings.Card>
        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart fullWidth>
            <Box>
              <Settings.SubSection.Title>Knowledge Base and Generative No Match</Settings.SubSection.Title>

              <Settings.SubSection.Description mt={4} mr={48}>
                Generate answers from added data sources. If none exist, automate responses to keep the conversation on track and answer questions.{' '}
                <System.Link.Anchor href={LEARN_KNOWLEDGE_BASE}>Learn more</System.Link.Anchor>
              </Settings.SubSection.Description>
            </Box>

            <WorkspaceDisabledTooltip disabled={projectAIPlaygroundEnabled}>
              <Toggle
                size={Toggle.Size.EXTRA_SMALL}
                checked={projectAIPlaygroundEnabled && aiAssistSettings?.generateNoMatch}
                disabled={!projectAIPlaygroundEnabled}
                onChange={onGenerateNoMatchToggle}
                hasLabel
              />
            </WorkspaceDisabledTooltip>
          </Box.FlexApart>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default AIAssistant;
