import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

interface BuiltInPromptProps {
  setShowUtteranceSection: (val: boolean) => void;
}

const BuiltInPrompt: React.FC<BuiltInPromptProps> = ({ setShowUtteranceSection }) => (
  <Box padding="24px 32px" backgroundColor="#fdfdfd">
    <Box color="#62778c" mb={16}>
      Built-in intents don’t require sample phrases. However, if you’d like to add more you can extend the intent.
    </Box>

    <Button variant={ButtonVariant.SECONDARY} onClick={() => setShowUtteranceSection(true)}>
      Extend Intent
    </Button>
  </Box>
);

export default BuiltInPrompt;
