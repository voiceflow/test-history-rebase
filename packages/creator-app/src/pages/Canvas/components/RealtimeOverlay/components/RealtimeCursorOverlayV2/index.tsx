import React from 'react';

import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { useRealtimeSelector, useSelector } from '@/hooks';

import { RealtimeCursor } from './components';

const RealtimeCursorOverlay: React.FC = () => {
  const userID = useSelector(Account.userIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const creatorIDs = useRealtimeSelector((state) => Realtime.diagramViewersIDsSelector(state, diagramID));

  return (
    <>
      {creatorIDs.map((creatorID) => (userID === creatorID ? null : <RealtimeCursor key={creatorID} diagramID={diagramID} creatorID={creatorID} />))}
    </>
  );
};

export default RealtimeCursorOverlay;
