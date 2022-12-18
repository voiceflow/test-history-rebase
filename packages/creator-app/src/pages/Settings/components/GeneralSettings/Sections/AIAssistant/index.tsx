import { Box, Flex, Link, SectionV2, Text, Toggle } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection, SettingsTitleBadge } from '@/components/Settings';

const AIAssistant: React.FC = () => {
  const [checked, setChecked] = React.useState(false);

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

          <Toggle checked={checked} size={Toggle.Size.EXTRA_SMALL} onChange={() => setChecked(!checked)} hasLabel />
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default AIAssistant;
