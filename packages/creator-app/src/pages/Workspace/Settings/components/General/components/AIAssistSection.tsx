import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, SectionV2, Text, Toggle } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import { useFeature } from '@/hooks';

const AIAssistSection: React.FC = () => {
  const { isEnabled: isAssistantAiEnabled } = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const [aiAssistEnabled, setAiAssistEnabled] = React.useState(false);

  if (!isAssistantAiEnabled) return null;

  return (
    <SettingsSection
      variant={SectionVariants.PRIMARY}
      title="Voiceflow AI Assist"
      noContentPadding
      description={
        <>
          Leverage practical AI to design, manage and improve your assistants faster than previously possible. <Link>Learn more</Link>
        </>
      }
    >
      <SettingsSubSection growInput={false} topOffset={3}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>
              <Text>Voiceflow AI Assist</Text>
            </SectionV2.Title>
            <Box mt={4}>
              <Text color="#62778c" fontSize="13px">
                Enable or disable workspace members to access AI Assist features.
              </Text>
            </Box>
          </div>

          <Toggle checked={aiAssistEnabled} size={Toggle.Size.EXTRA_SMALL} onChange={() => setAiAssistEnabled(!aiAssistEnabled)} hasLabel />
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default AIAssistSection;
