import { Subscribe } from '@react-rxjs/core';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { EventualEngineContext } from '@/contexts';
import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { OverlayType } from '@/pages/Canvas/constants';
import { linkPoints$ } from '@/store/observables';

import { RealtimeLink } from './components';

const RealtimeLinkOverlay: React.FC = () => {
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const userID = useSelector(Account.userIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const viewers = useSelector(DiagramV2.diagramViewersByIDSelector, { id: diagramID });

  React.useEffect(
    () =>
      eventualEngine.get()?.realtime.register(OverlayType.CURSOR, {
        moveMouse: Utils.functional.noop,
        removeUser: Utils.functional.noop,
        panViewport: Utils.functional.noop,
        zoomViewport: Utils.functional.noop,
      }),
    []
  );

  return (
    <>
      {viewers.map((viewer) => {
        if (userID === viewer.creatorID) return null;

        const source$ = linkPoints$({ diagramID, creatorID: viewer.creatorID });

        return (
          <Subscribe key={viewer.creatorID} source$={source$}>
            <RealtimeLink source$={source$} creatorID={viewer.creatorID} color={viewer.color} />
          </Subscribe>
        );
      })}
    </>
  );
};

export default RealtimeLinkOverlay;
