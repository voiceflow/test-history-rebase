import { toast, useCache } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Account from '@/ducks/account';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';

const TranscriptUpdates: React.FC = () => {
  const removeTranscript = useDispatch(Transcript.removeTranscript);
  const currentSelectedTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);
  const activeUserID = useSelector(Account.userIDSelector);
  const cache = useCache({ currentSelectedTranscriptID });

  React.useEffect(() => {
    return client.socket.project.watchForTranscriptDelete(({ transcriptID, userID }) => {
      if (transcriptID === cache.current.currentSelectedTranscriptID && userID !== activeUserID) {
        toast.info(`Another user has deleted transcript: ${transcriptID}`);
      }

      removeTranscript(transcriptID);
    });
  }, [removeTranscript]);

  return null;
};

export default TranscriptUpdates;
