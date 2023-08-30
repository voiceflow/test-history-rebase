import { Box, Button, ButtonVariant, ClickableText, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { Identifier } from '@/styles/constants';

import { Container } from './components';

export interface PrototypeResetProps {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  onSave: VoidFunction;
}

const PrototypeReset: React.FC<PrototypeResetProps> = ({ onSave, onClick }) => {
  const [transcriptSaved, setTranscriptSaved] = React.useState(true);
  return (
    <Container>
      <div>
        <Text color={ThemeColor.SECONDARY}>
          Conversation has ended.{' '}
          <ClickableText id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
            Reset Test
          </ClickableText>{' '}
        </Text>
      </div>

      <Box.Flex justifyContent="flex-end">
        <Button
          id={Identifier.SAVE_TRANSCRIPT_BUTTON}
          variant={ButtonVariant.PRIMARY}
          onClick={() => {
            onSave();
            setTranscriptSaved(false);
          }}
          disabled={!transcriptSaved}
        >
          Save
        </Button>
      </Box.Flex>
    </Container>
  );
};

export default PrototypeReset;
