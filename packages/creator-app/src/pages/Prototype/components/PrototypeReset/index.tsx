import { Button, ButtonVariant, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import { goToTargetTranscript } from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, Splitter } from './components';

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
      <Button variant={ButtonVariant.TERTIARY} id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
        Reset Test
      </Button>
      <>
        <Splitter />
        <Button
          id={Identifier.SAVE_TRANSCRIPT_BUTTON}
          variant={ButtonVariant.TERTIARY}
          onClick={() => {
            onSave();
            setTranscriptSaved(false);
          }}
          disabled={!transcriptSaved}
        >
          Save Test
        </Button>
      </>
    </Container>
  );
};

const mapDispatchToProps = {
  savePrototypeSession: Transcripts.createTranscript,
  goToTargetTranscript,
};

type ConnectedPrototypeResetProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PrototypeReset) as React.FC<PrototypeResetProps>;
