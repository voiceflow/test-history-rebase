import { Box, Flex, Link, SectionV2, Text, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import { useFreestyleFeature } from '@/components/GPT';
import { SectionVariants, SettingsSection, SettingsSubSection, SettingsTitleBadge } from '@/components/Settings';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useActiveWorkspace, useDispatch, useSelector, useTrackingEvents } from '@/hooks';

const ToggleTooltip: React.FC = ({ children }) => (
  <TippyTooltip
    html={
      <div style={{ width: '195px', display: 'flex', justifyContent: 'left', textAlign: 'left' }}>
        AI Assist Features have been disabled for this workspace by a workspace admin.
      </div>
    }
  >
    {children}
  </TippyTooltip>
);

const AIAssistant: React.FC = () => {
  const workspace = useActiveWorkspace();
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);
  const updateProjectAiAssistSettings = useDispatch(Project.updateProjectAiAssistSettings);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const [trackingEvents] = useTrackingEvents();
  const freestyle = useFreestyleFeature();

  const handleGenerativeTasksToggle = () => {
    if (!activeProjectID) return;
    const enabled = !aiAssistSettings?.generativeTasks;
    updateProjectAiAssistSettings(activeProjectID, { ...aiAssistSettings, generativeTasks: enabled });
    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled, flag: GPT.FeatureToggle.GENERATIVE });
  };

  const handleFreestyleToggle = () => {
    if (!activeProjectID) return;
    const enabled = !aiAssistSettings?.freestyle;
    updateProjectAiAssistSettings(activeProjectID, { ...aiAssistSettings, freestyle: enabled });
    trackingEvents.trackProjectGenerateAIFeatureToggled({ enabled, flag: GPT.FeatureToggle.FREESTYLE });
  };

  return (
    <SettingsSection
      variant={SectionVariants.PRIMARY}
      title={
        <Flex>
          AI Assistant <SettingsTitleBadge>Beta</SettingsTitleBadge>
        </Flex>
      }
      noContentPadding
      description={
        <>
          Leverage practical AI to design, manage and improve your assistant faster than previously possible. <Link>Learn more</Link>
        </>
      }
    >
      <SettingsSubSection growInput={false} topOffset={3}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>
              <Text>Generative Tasks</Text>
            </SectionV2.Title>
            <Box mt={4}>
              <Text color="#62778c" fontSize="13px">
                Manually generate data like utterances, responses, no match etc. <Link>Learn more</Link>
              </Text>
            </Box>
          </div>

          <ToggleTooltip>
            <Toggle
              disabled={!workspace?.settings.aiAssist}
              checked={!!workspace?.settings.aiAssist && aiAssistSettings?.generativeTasks}
              size={Toggle.Size.EXTRA_SMALL}
              onChange={handleGenerativeTasksToggle}
              hasLabel
            />
          </ToggleTooltip>
        </Box.FlexApart>
      </SettingsSubSection>

      {freestyle.isEnabled && (
        <>
          <SectionV2.Divider />

          <SettingsSubSection growInput={false} topOffset={3}>
            <Box.FlexApart width="100%">
              <div>
                <SectionV2.Title bold>
                  <Text>Freestyle</Text>
                </SectionV2.Title>
                <Box mt={4}>
                  <Text color="#62778c" fontSize="13px">
                    Auto dialog to keep the conversation on track and answer questions. <Link>Learn more</Link>
                  </Text>
                </Box>
              </div>

              <ToggleTooltip>
                <Toggle
                  disabled={!workspace?.settings.aiAssist}
                  checked={!!workspace?.settings.aiAssist && aiAssistSettings?.freestyle}
                  size={Toggle.Size.EXTRA_SMALL}
                  onChange={handleFreestyleToggle}
                  hasLabel
                />
              </ToggleTooltip>
            </Box.FlexApart>
          </SettingsSubSection>
        </>
      )}
    </SettingsSection>
  );
};

export default AIAssistant;
