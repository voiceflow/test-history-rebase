import { Utils } from '@voiceflow/common';
import { useCache, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { PrototypeStatus } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { activeProjectIDSelector } from '@/ducks/session';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import PrototypeChatDisplay from '@/pages/Prototype/components/PrototypeChatDisplay';
import { Message, MessageType } from '@/pages/Prototype/types';

import { Container, DialogHeader, DialogLoader, NoData } from './components';
import { generateTurnMap, transformDialogTimestamp, TurnMap } from './util';

export type { TurnMap };

const DEBUG_LOCAL_STORAGE_BOOL_KEY = 'show_conversation_debugs';
const INTENT_CONF_LOCAL_STORAGE_BOOL_KEY = 'show_conversation_intent_conf';

const TranscriptDialog: React.FC = () => {
  const color = useSelector(Prototype.prototypeBrandColorSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  const [atTop, setAtTop] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [hasNoData, setHasNoData] = React.useState(false);
  const [dialogTurnMap, setDialogTurnMap] = React.useState<TurnMap>(() => new Map());

  const [showDebugs, setShowDebugs] = useLocalStorageState(DEBUG_LOCAL_STORAGE_BOOL_KEY, false);
  const [showIntentConfidence, setShowIntentConfidence] = useLocalStorageState(INTENT_CONF_LOCAL_STORAGE_BOOL_KEY, true);

  const cache = useCache({ currentTranscriptID });

  const fetchDialogs = async (targetTranscriptID: string) => {
    setLoading(true);

    const dialogs = await client.transcript.getTranscriptDialog(activeProjectID, targetTranscriptID);

    // skip state update if we're not on the active transcript
    if (cache.current.currentTranscriptID !== targetTranscriptID) return;

    if (dialogs?.length) {
      setMessages(transformDialogTimestamp(dialogs, dialogs[0].startTime));
      setDialogTurnMap(generateTurnMap(dialogs));

      setLoading(false);
      setHasNoData(false);
      setDialogTurnMap(new Map());
    } else {
      setMessages([]);
      setLoading(false);
      setHasNoData(true);
    }
  };

  const messageFilter = React.useCallback(
    (messages: Message[]) => {
      return messages.filter((message: Message) => {
        if (showDebugs || message.type !== MessageType.DEBUG) return true;
        if (message.message.startsWith('matched intent') && !showDebugs && showIntentConfidence) return true;
        return false;
      });
    },
    [showDebugs, showIntentConfidence]
  );

  React.useEffect(() => {
    if (!currentTranscriptID) {
      setMessages([]);
    } else {
      fetchDialogs(currentTranscriptID);
    }
  }, [currentTranscriptID]);

  if (hasNoData && !loading) {
    return (
      <Container>
        <NoData />
      </Container>
    );
  }

  return (
    <Container>
      <DialogHeader
        showDebugs={showDebugs}
        isScrolling={!atTop}
        toggleDebugs={() => setShowDebugs(!showDebugs)}
        toggleIntentConf={() => setShowIntentConfidence(!showIntentConfidence)}
        showIntentConfidence={showIntentConfidence}
      />
      {loading ? (
        <DialogLoader />
      ) : (
        <PrototypeChatDisplay
          setAtTop={setAtTop}
          avatarURL={avatar}
          color={color}
          dialogTurnMap={dialogTurnMap}
          isTranscript={true}
          messages={messages}
          debug={true}
          interactions={[]}
          status={PrototypeStatus.ENDED}
          hideSessionMessages={false}
          showPadding
          onInteraction={alert}
          stepBack={Utils.functional.noop}
          autoScroll={false}
          messageFilter={messageFilter}
        />
      )}
    </Container>
  );
};

export default TranscriptDialog;
