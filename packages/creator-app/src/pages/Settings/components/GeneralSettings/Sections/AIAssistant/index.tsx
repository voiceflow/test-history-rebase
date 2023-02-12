import { BaseModels } from '@voiceflow/base-types';
import { Badge, Box, Link, SectionV2, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import * as Settings from '@/components/Settings';
import { AI_GENERAL_LINK, LEARN_FREESTYLE, LEARN_GENERATIVE_TASKS } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useActiveWorkspace, useDispatch, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { SettingSections } from '@/pages/Settings/constants';

import { useAutoScrollSectionIntoView } from '../hooks';
import { WorkspaceDisabledTooltip } from './components';

const AIAssistant: React.FC = () => {
  const workspace = useActiveWorkspace();
  const [trackingEvents] = useTrackingEvents();

  const freestyleDisclaimerModal = ModalsV2.useModal(ModalsV2.FreestyleDisclaimer);

  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);
  const freestyleDisclaimerPermission = usePermission(Permission.FREESTLYE_DISCLAIMER);

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
    const freestyleEnabled = aiAssistSettings?.freestyle;

    if (!freestyleEnabled && freestyleDisclaimerPermission.allowed) {
      freestyleDisclaimerModal.openVoid();
    } else {
      onPatchAiAssistSettings({ freestyle: !freestyleEnabled });
      trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled: !freestyleEnabled, flag: GPT.FeatureToggle.FREESTYLE });
    }
  };

  const [sectionRef] = useAutoScrollSectionIntoView(SettingSections.AI_ASSISTANT);

  return (
    <Settings.Section
      ref={sectionRef}
      title={
        <Box.Flex>
          AI Assist <Badge.Descriptive marginLeft={9}>Beta</Badge.Descriptive>
        </Box.Flex>
      }
      description={
        <>
          Leverage practical AI to design, manage and improve your assistant faster than previously possible.{' '}
          <Link href={AI_GENERAL_LINK}>Learn more</Link>
        </>
      }
    >
      <Settings.Card>
        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart fullWidth>
            <div>
              <Settings.SubSection.Title>Generative Tasks</Settings.SubSection.Title>

              <Settings.SubSection.Description>
                Manually generate data like utterances, responses, no match etc. <Link href={LEARN_GENERATIVE_TASKS}>Learn more</Link>
              </Settings.SubSection.Description>
            </div>

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
        </Settings.SubSection>

        <SectionV2.Divider />

        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart fullWidth>
            <Box>
              <Settings.SubSection.Title>Freestyle</Settings.SubSection.Title>

              <Settings.SubSection.Description mt={4}>
                Auto dialog to keep the conversation on track and answer questions. <Link href={LEARN_FREESTYLE}>Learn more</Link>
              </Settings.SubSection.Description>
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
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default AIAssistant;
