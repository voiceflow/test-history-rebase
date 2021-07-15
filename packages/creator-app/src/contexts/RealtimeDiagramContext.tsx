import { useContextApi, withProvider } from '@voiceflow/ui';
import React from 'react';

import * as Realtime from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { AtomFactory, useAtomFactory } from '@/hooks/atoms';
import { useSelector } from '@/hooks/redux';
import { Point } from '@/types';

import { createAtomContext } from './AtomContext';
import { RealtimeStoreContext } from './RealtimeStoreContext';

interface CursorCoordsParam {
  tabID: string;
}

const DiagramAtomContext = createAtomContext();

export interface RealtimeDiagramContextValue {
  cursorCoordsAtom: AtomFactory<Point, Readonly<CursorCoordsParam>>;
}

export const RealtimeDiagramContext = React.createContext<RealtimeDiagramContextValue | null>(null);

export const RealtimeDiagramProvider = withProvider(DiagramAtomContext.UncontrolledProvider)(({ children }: React.PropsWithChildren<{}>) => {
  const { store } = React.useContext(RealtimeStoreContext);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;

  const cursorCoordsAtom = useAtomFactory('diagram.cursorCoords', {
    default: ({ tabID }: Readonly<CursorCoordsParam>) => Realtime.cursorCoordsSelector(store.getState())(diagramID, tabID),
    context: DiagramAtomContext,
  });

  const diagramAtoms = useContextApi({
    cursorCoordsAtom,
  });

  React.useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        const tabIDs = Realtime.diagramViewersTabIDsSelector(state)(diagramID);

        tabIDs.forEach((tabID) => {
          const coords = Realtime.cursorCoordsSelector(state)(diagramID, tabID);

          return cursorCoordsAtom({ tabID }).update(coords);
        });
      }),
    []
  );

  return <RealtimeDiagramContext.Provider value={diagramAtoms}>{children}</RealtimeDiagramContext.Provider>;
}) as React.FC;
