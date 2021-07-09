import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { activeProjectIDSelector } from '@/ducks/session';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';
import { noop } from '@/utils/functional';

import { Container, DialogHeader } from './components';

const TranscriptDialog: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const activeProjectID = useSelector(activeProjectIDSelector);

  const fetchDialogs = async () => {
    const dialogs = await client.transcript.getTranscriptDialog(activeProjectID!, currentTranscriptID!);
    setMessages(dialogs);
  };

  React.useEffect(() => {
    if (!currentTranscriptID) {
      setMessages([]);
    } else {
      fetchDialogs();
    }
  }, [currentTranscriptID]);

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
        messages={messages}
        interactions={[]}
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
