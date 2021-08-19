import { Request } from '@voiceflow/base-types';
import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype/types';
import * as Recent from '@/ducks/recent';
import { activeProjectIDSelector } from '@/ducks/session';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import PrototypeChatDisplay from '@/pages/Prototype/components/PrototypeChatDisplay';
import { Message } from '@/pages/Prototype/types';
import { noop } from '@/utils/functional';

import { Container, DialogHeader, DialogLoader } from './components';
import { filterAndTransformDialogs } from './util';

const TranscriptDialog: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const activeProjectID = useSelector(activeProjectIDSelector);
  const debugMessage = useSelector(Recent.prototypeDebugSelector);
  const intentConfidence = useSelector(Recent.prototypeIntentSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const color = useSelector(Prototype.prototypeBrandColorSelector);
  const dispatch = useDispatch();
  const store = useStore();

  const fetchDialogs = async (targetTranscriptID: string) => {
    setLoading(true);
    const dialogs = await client.transcript.getTranscriptDialog(activeProjectID!, targetTranscriptID!);
    const currentTranscriptID = currentTranscriptIDSelector(store.getState());
    if (currentTranscriptID === targetTranscriptID && dialogs) {
      setLoading(false);
      const modifiedDialogs = filterAndTransformDialogs(dialogs, dialogs[0].startTime);
      setMessages(modifiedDialogs);
    }
  };

  React.useEffect(() => {
    if (!currentTranscriptID) {
      setMessages([]);
    } else {
      fetchDialogs(currentTranscriptID);
    }
  }, [currentTranscriptID]);

  const handleMessageClick = () => {};

  const handleChange = (isDebugToggled: boolean) => {
    isDebugToggled
      ? dispatch(Recent.updateRecentPrototype({ debug: !debugMessage }))
      : dispatch(Recent.updateRecentPrototype({ intent: !intentConfidence }));
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget.scrollTop !== 0) {
      setIsScrolling(true);
    } else {
      setIsScrolling(false);
    }
  };
  return (
    <Container>
      <DialogHeader
        isScrolling={isScrolling}
        handleChange={handleChange}
        transcriptInformation={{ intentConfidenceToggled: intentConfidence, debugMessageToggled: debugMessage }}
      />
      {loading ? (
        <DialogLoader />
      ) : (
        <PrototypeChatDisplay
          onScroll={onScroll}
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
          onInteraction={(request: string | Request.BaseRequest) => alert(request)}
          stepBack={() => noop()}
          autoScroll={false}
        />
      )}
    </Container>
  );
};

export default TranscriptDialog;
