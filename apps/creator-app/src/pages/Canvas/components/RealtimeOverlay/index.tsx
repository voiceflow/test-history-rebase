import { withProvider } from '@voiceflow/ui';
import React from 'react';

import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { OverlayType } from '@/pages/Canvas/constants';

import { RealtimeCursor } from './components';
import { RealtimeCursorContext } from './contexts';

const RealtimeCursorOverlayV2: React.FC = () => {
  const cursorContext = React.useContext(RealtimeCursorContext.Context);
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const userID = useSelector(Account.userIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const viewers = useSelector(DiagramV2.diagramViewersByIDSelector, { id: diagramID });

  React.useEffect(
    () =>
      eventualEngine.get()?.io.register(OverlayType.CURSOR_V2, {
        panViewport: (movement) => cursorContext?.emit('panViewport', movement),
        zoomViewport: (calculateMovement) => cursorContext?.emit('zoomViewport', calculateMovement),
        realtimeCursorMove: ({ diagramID, creatorID, coords }) =>
          cursorContext?.emit(`realtimeCursorMove:${diagramID}:${creatorID}`, coords),
      }),
    []
  );

  return (
    <>
      {viewers.map((viewer) => {
        if (userID === viewer.creatorID) return null;
        return (
          <RealtimeCursor
            key={viewer.creatorID}
            diagramID={diagramID}
            creatorID={viewer.creatorID}
            name={viewer.name}
            color={viewer.color}
          />
        );
      })}
    </>
  );
};

export default withProvider(RealtimeCursorContext.Dispatcher)(RealtimeCursorOverlayV2);
