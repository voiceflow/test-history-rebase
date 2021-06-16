import React from 'react';

import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { Message } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';
import { noop } from '@/utils/functional';

import { Container, DialogHeader } from './components';
import { MOCK_INTERACTIONS, MOCK_MESSAGES } from './MockData';

interface TranscriptDialogProps {
  messages?: Message[];
}

const TranscriptDialog: React.FC<TranscriptDialogProps> = ({ messages = MOCK_MESSAGES }) => {
  const [input, setInput] = React.useState('');

  return (
    <Container>
      <DialogHeader />
      <ChatDialog
        locale="locale"
        input={input}
        onStart={() => alert()}
        layout={PrototypeLayout.TEXT_DIALOG}
        onMute={() => alert()}
        onSend={(request) => alert(request)}
        onReset={() => alert()}
        onPlay={(src) => alert(src)}
        messages={messages}
        interactions={MOCK_INTERACTIONS}
        onInputChange={(input) => setInput(input)}
        prototypeStatus={PrototypeStatus.ACTIVE}
        finalTranscript="finalTranscript"
        onStopListening={() => alert()}
        onStartListening={() => alert()}
        interimTranscript="interimTranscript"
        isMicrophonePermissionGranted={true}
        isSpeechSpeechRecognitionSupported={false}
        hasInput={false}
        onStepBack={() => noop()}
      />
    </Container>
  );
};

export default TranscriptDialog;
