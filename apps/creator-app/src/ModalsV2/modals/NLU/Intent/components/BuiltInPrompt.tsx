import { Box, Button, ButtonVariant, System } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { NONE_INTENT } from '@/config/documentation';

interface BuiltInPromptProps {
  intentID?: string;
  setShowUtteranceSection: (val: boolean) => void;
}

const IntentDescription: Record<string, React.ReactNode> = {
  [VoiceflowConstants.IntentName.NONE]: (
    <>
      Extend the Fallback intent to handle any utterances that shouldn't match other intents.{' '}
      <System.Link.Anchor href={NONE_INTENT}>Learn more</System.Link.Anchor>
    </>
  ),
  default: 'Built-in intents don’t require sample phrases. However, if you’d like to add more you can extend the intent.',
};

const BuiltInPrompt: React.FC<BuiltInPromptProps> = ({ intentID, setShowUtteranceSection }) => (
  <Box padding="24px 32px" backgroundColor="#fdfdfd">
    <Box color="#62778c" mb={16}>
      {(intentID && IntentDescription[intentID]) ?? IntentDescription.default}
    </Box>

    <Button variant={ButtonVariant.SECONDARY} onClick={() => setShowUtteranceSection(true)}>
      Extend Intent
    </Button>
  </Box>
);

export default BuiltInPrompt;
