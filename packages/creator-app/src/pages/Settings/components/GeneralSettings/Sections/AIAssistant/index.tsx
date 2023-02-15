import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, Link, SectionV2, toast, Toggle } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as GPT from '@/components/GPT';
import * as Settings from '@/components/Settings';
import { AI_GENERAL_LINK, LEARN_GENERATE_NO_MATCH, LEARN_GENERATE_STEP, LEARN_GENERATIVE_TASKS } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useActiveWorkspace, useDispatch, useFeature, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { SettingSections } from '@/pages/Settings/constants';
import logger from '@/utils/logger';

import { useAutoScrollSectionIntoView } from '../hooks';
import { WorkspaceDisabledTooltip } from './components';
import { GENERATE_NO_MATCH_DISCLAIMER, GENERATE_STEP_DISCLAIMER } from './constants';

const AIAssistant: React.FC = () => {
  const workspace = useActiveWorkspace();
  const [trackingEvents] = useTrackingEvents();

  const disclaimerModal = ModalsV2.useModal(ModalsV2.Disclaimer);

  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);
  const generateStepDisclaimerPermission = usePermission(Permission.GENERATE_STEP_DISCLAIMER);
  const generateNoMatchDisclaimerPermission = usePermission(Permission.GENERATE_NO_MATCH_DISCLAIMER);

  const generateStepEnabled = !!useFeature(Realtime.FeatureFlag.GPT_GENERATIVE_RESPONSE)?.isEnabled;

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

  const onGenerateNoMatchToggle = async () => {
    const generateNoMatchEnabled = aiAssistSettings?.generateNoMatch;

    if (!generateNoMatchEnabled && generateNoMatchDisclaimerPermission.allowed) {
      if (!(await disclaimerModal.openVoid(GENERATE_NO_MATCH_DISCLAIMER))) return;

      client.apiV3.fetch.post(`/projects/${activeProjectID}/sendFreestyleDisclaimer`).catch((error) => {
        logger.error(error);
        toast.error('unable to send disclaimer email');
      });
      trackingEvents.trackGenerateNoMatchDisclaimerAccepted();
    }

    onPatchAiAssistSettings({ generateNoMatch: !generateNoMatchEnabled });
    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled: !generateNoMatchEnabled, flag: GPT.FeatureToggle.GENERATE_NO_MATCH });
  };

  const onGenerateStepToggle = async () => {
    const generateStepEnabled = aiAssistSettings?.generateStep;

    if (!generateStepEnabled && generateStepDisclaimerPermission.allowed) {
      if (!(await disclaimerModal.openVoid(GENERATE_STEP_DISCLAIMER))) return;

      trackingEvents.trackGenerateStepDisclaimerAccepted();
    }

    onPatchAiAssistSettings({ generateStep: !generateStepEnabled });
    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled: !generateStepEnabled, flag: GPT.FeatureToggle.GENERATE_STEP });
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
              <Settings.SubSection.Title>Generate No Match</Settings.SubSection.Title>

              <Settings.SubSection.Description mt={4}>
                Auto dialog to keep the conversation on track and answer questions. <Link href={LEARN_GENERATE_NO_MATCH}>Learn more</Link>
              </Settings.SubSection.Description>
            </Box>

            <WorkspaceDisabledTooltip disabled={workspaceAIEnabled}>
              <Toggle
                size={Toggle.Size.EXTRA_SMALL}
                checked={workspaceAIEnabled && aiAssistSettings?.generateNoMatch}
                disabled={!workspaceAIEnabled}
                onChange={onGenerateNoMatchToggle}
                hasLabel
              />
            </WorkspaceDisabledTooltip>
          </Box.FlexApart>
        </Settings.SubSection>

        {generateStepEnabled && (
          <>
            <SectionV2.Divider />

            <Settings.SubSection contentProps={{ topOffset: 3 }}>
              <Box.FlexApart fullWidth>
                <Box>
                  <Settings.SubSection.Title>Generate Step</Settings.SubSection.Title>

                  <Settings.SubSection.Description mt={4}>
                    Generate responses at runtime based on variables and a prompt. <Link href={LEARN_GENERATE_STEP}>Learn more</Link>
                  </Settings.SubSection.Description>
                </Box>

                <WorkspaceDisabledTooltip disabled={workspaceAIEnabled}>
                  <Toggle
                    size={Toggle.Size.EXTRA_SMALL}
                    checked={workspaceAIEnabled && aiAssistSettings?.generateStep}
                    disabled={!workspaceAIEnabled}
                    onChange={onGenerateStepToggle}
                    hasLabel
                  />
                </WorkspaceDisabledTooltip>
              </Box.FlexApart>
            </Settings.SubSection>
          </>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default AIAssistant;
