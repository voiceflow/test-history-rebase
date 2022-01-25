import { BoxFlex, Button, ButtonVariant, ClickableText, Text, ThemeColor, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import { goToTargetTranscript } from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container } from './components';

export interface PrototypeResetProps {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}

const PrototypeReset: React.FC<PrototypeResetProps & ConnectedPrototypeResetProps> = ({ savePrototypeSession, onClick, goToTargetTranscript }) => {
  const [transcriptSaved, setTranscriptSaved] = React.useState(true);

  const onSave = async () => {
    try {
      const newTranscriptID = await savePrototypeSession();
      toast.success(
        <>
          Test saved to Conversations <br />
          <ToastCallToAction
            onClick={() => {
              goToTargetTranscript(newTranscriptID!);
            }}
          >
            Go to conversation
          </ToastCallToAction>
        </>
      );
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

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

      <BoxFlex justifyContent="flex-end">
        <Button
          id={Identifier.SAVE_TRANSCRIPT_BUTTON}
          variant={ButtonVariant.PRIMARY}
          squareRadius
          onClick={() => {
            onSave();
            setTranscriptSaved(false);
          }}
          disabled={!transcriptSaved}
        >
          Save
        </Button>
      </BoxFlex>
    </Container>
  );
};

const mapDispatchToProps = {
  savePrototypeSession: Transcripts.createTranscript,
  goToTargetTranscript,
};

type ConnectedPrototypeResetProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PrototypeReset) as React.FC<PrototypeResetProps>;
