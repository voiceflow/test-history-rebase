import { Subscribe } from '@react-rxjs/core';
import { Utils } from '@voiceflow/common';
import { withProvider } from '@voiceflow/ui';
import React from 'react';

import { EventualEngineContext } from '@/contexts';
import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { OverlayType } from '@/pages/Canvas/constants';
import { cursorCoords$ } from '@/store/observables';

import { RealtimeCursorContext } from '../../contexts';
import { RealtimeCursor } from './components';

const RealtimeCursorOverlay: React.FC = () => {
  const cursorContext = React.useContext(RealtimeCursorContext.Context);
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const userID = useSelector(Account.userIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const viewers = useSelector(DiagramV2.diagramViewersByIDSelector, { id: diagramID });

  React.useEffect(
    () =>
      eventualEngine.get()?.realtime.register(OverlayType.CURSOR, {
        moveMouse: Utils.functional.noop,
        removeUser: Utils.functional.noop,

        zoomViewport: (calculateMovement) => cursorContext?.emit('zoomViewport', calculateMovement),
        panViewport: (movement) => cursorContext?.emit('panViewport', movement),
      }),
    []
  );

  return (
    <>
      {viewers.map((viewer) => {
        if (userID === viewer.creatorID) return null;

        const source$ = cursorCoords$({ diagramID, creatorID: viewer.creatorID });

        return (
          <Subscribe key={viewer.creatorID} source$={source$}>
            <RealtimeCursor source$={source$} diagramID={diagramID} creatorID={viewer.creatorID} name={viewer.name} color={viewer.color} />
          </Subscribe>
        );
      })}
    </>
  );
};

export default withProvider(RealtimeCursorContext.Dispatcher)(RealtimeCursorOverlay);
