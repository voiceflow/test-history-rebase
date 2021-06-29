import React from 'react';
import { useSelector } from 'react-redux';

import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import { Interaction } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';
import { noop } from '@/utils/functional';

import { Container, DialogHeader } from './components';

const MOCK_INTERACTIONS: Interaction[] = [
  {
    name: 'Interaction Test 1',
    request: { type: 'type', payload: undefined },
  },
  {
    name: 'Interaction Test 2',
    request: { type: 'type', payload: undefined },
  },
];

const TranscriptDialog: React.FC = () => {
  const [input, setInput] = React.useState('');
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);

  return (
    <Container>
      <DialogHeader />
      <ChatDialog
        autoScroll={false}
        locale="locale"
        input={input}
        onStart={() => alert()}
        layout={PrototypeLayout.TEXT_DIALOG}
        onMute={() => alert()}
        onSend={(request) => alert(request)}
        onReset={() => alert()}
        onPlay={(src) => alert(src)}
        messages={currentTranscript?.messages}
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
