import { BaseModels } from '@voiceflow/base-types';
import { Box, Link, SectionV2, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import { SectionVariants, SettingsSection, SettingsSubSection, SettingsTitleBadge } from '@/components/Settings';
import { AI_GENERAL_LINK, LEARN_FREESTYLE, LEARN_GENERATIVE_TASKS } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useActiveWorkspace, useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { SettingSections } from '@/pages/Settings/constants';

import { useAutoScrollSectionIntoView } from '../hooks';
import { WorkspaceDisabledTooltip } from './components';

const AIAssistant: React.FC = () => {
  const workspace = useActiveWorkspace();
  const [trackingEvents] = useTrackingEvents();

  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);

  const updateProjectAiAssistSettings = useDispatch(Project.updateProjectAiAssistSettings);

  const workspaceAIEnabled = !!workspace?.settings.aiAssist;

  const onPatchAiAssistSettings = (settings: Partial<BaseModels.Project.AIAssistSettings>) => {
    if (!activeProjectID || !workspaceAIEnabled) return;

    updateProjectAiAssistSettings(activeProjectID, { ...aiAssistSettings, ...settings });
  };

  const onGenerativeTasksToggle = () => {
    const enabled = !aiAssistSettings?.generativeTasks;

    onPatchAiAssistSettings({ generativeTasks: enabled });

    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled, flag: GPT.FeatureToggle.GENERATIVE });
  };

  const onFreestyleToggle = () => {
    const enabled = !aiAssistSettings?.freestyle;

    onPatchAiAssistSettings({ freestyle: enabled });

    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled, flag: GPT.FeatureToggle.FREESTYLE });
  };

  const freestyle = GPT.useFreestyleFeature();
  const [sectionRef] = useAutoScrollSectionIntoView(SettingSections.AI_ASSISTANT);

  return (
    <SettingsSection
      ref={sectionRef}
      variant={SectionVariants.PRIMARY}
      noContentPadding
      title={
        <Box.Flex>
          AI Assistant <SettingsTitleBadge>Beta</SettingsTitleBadge>
        </Box.Flex>
      }
      description={
        <>
          Leverage practical AI to design, manage and improve your assistant faster than previously possible.{' '}
          <Link href={AI_GENERAL_LINK}>Learn more</Link>
        </>
      }
    >
      <SettingsSubSection growInput={false} topOffset={3}>
        <Box.FlexApart fullWidth>
          <Box>
            <SectionV2.Title bold>Generative Tasks</SectionV2.Title>

            <SectionV2.Description mt={4} block secondary>
              Manually generate data like utterances, responses, no match etc. <Link href={LEARN_GENERATIVE_TASKS}>Learn more</Link>
            </SectionV2.Description>
          </Box>

          <WorkspaceDisabledTooltip disabled={workspaceAIEnabled}>
            <Toggle
              size={Toggle.Size.EXTRA_SMALL}
              checked={workspaceAIEnabled && aiAssistSettings?.generativeTasks}
              disabled={!workspaceAIEnabled}
              onChange={onGenerativeTasksToggle}
              hasLabel
            />
          </WorkspaceDisabledTooltip>
        </Box.FlexApart>
      </SettingsSubSection>

      {freestyle.isEnabled && (
        <>
          <SectionV2.Divider />

          <SettingsSubSection growInput={false} topOffset={3}>
            <Box.FlexApart fullWidth>
              <Box>
                <SectionV2.Title bold>Freestyle</SectionV2.Title>

                <SectionV2.Description mt={4} block secondary>
                  Auto dialog to keep the conversation on track and answer questions. <Link href={LEARN_FREESTYLE}>Learn more</Link>
                </SectionV2.Description>
              </Box>

              <WorkspaceDisabledTooltip disabled={workspaceAIEnabled}>
                <Toggle
                  size={Toggle.Size.EXTRA_SMALL}
                  checked={workspaceAIEnabled && aiAssistSettings?.freestyle}
                  disabled={!workspaceAIEnabled}
                  onChange={onFreestyleToggle}
                  hasLabel
                />
              </WorkspaceDisabledTooltip>
            </Box.FlexApart>
          </SettingsSubSection>
        </>
      )}
    </SettingsSection>
  );
};

export default AIAssistant;
