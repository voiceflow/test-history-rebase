import React from 'react';

import * as Realtime from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { useRealtimeSelector, useSelector } from '@/hooks';

import { RealtimeCursor } from './components';

const RealtimeCursorOverlay: React.FC = () => {
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const tabIDs = useRealtimeSelector(Realtime.diagramViewersTabIDsSelector)(diagramID);

  return (
    <>
      {tabIDs.map((tabID) => (
        <RealtimeCursor key={tabID} diagramID={diagramID} tabID={tabID} />
      ))}
    </>
  );
};

export default RealtimeCursorOverlay;
