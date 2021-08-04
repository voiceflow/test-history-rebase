import { BaseRequest } from '@voiceflow/general-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype/types';
import * as Recent from '@/ducks/recent';
import { activeProjectIDSelector } from '@/ducks/session';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import PrototypeChatDisplay from '@/pages/Prototype/components/PrototypeChatDisplay';
import { Message } from '@/pages/Prototype/types';
import { noop } from '@/utils/functional';

import { Container, DialogHeader } from './components';

const TranscriptDialog: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const activeProjectID = useSelector(activeProjectIDSelector);
  const debugMessage = useSelector(Recent.prototypeDebugSelector);
  const intentConfidence = useSelector(Recent.prototypeIntentSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const color = useSelector(Prototype.prototypeBrandColorSelector);
  const dispatch = useDispatch();

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

  const handleMessageClick = () => {};

  const handleChange = (isDebugToggled: boolean) => {
    isDebugToggled
      ? dispatch(Recent.updateRecentPrototype({ debug: !debugMessage }))
      : dispatch(Recent.updateRecentPrototype({ intent: !intentConfidence }));
  };

  return (
    <Container>
      <DialogHeader
        handleChange={handleChange}
        transcriptInformation={{ intentConfidenceToggled: intentConfidence, debugMessageToggled: debugMessage }}
      />
      <PrototypeChatDisplay
        avatarURL={avatar}
        color={color}
        isTranscript={true}
        messages={messages}
        onPlay={handleMessageClick}
        debug={true}
        interactions={[]}
        status={PrototypeStatus.ENDED}
        hideSessionMessages={false}
        showPadding
        onInteraction={(request: string | BaseRequest) => alert(request)}
        stepBack={() => noop()}
        autoScroll={false}
      />
    </Container>
  );
};

export default TranscriptDialog;
