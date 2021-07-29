import { useContextApi, withProvider } from '@voiceflow/ui';
import React from 'react';

import * as Realtime from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { AtomFactory, useAtomFactory } from '@/hooks/atoms';
import { useSelector } from '@/hooks/redux';
import { Point } from '@/types';

import { createAtomContext } from './AtomContext';
import { RealtimeStoreContext } from './RealtimeStoreContext';

interface ViewerParam {
  creatorID: number;
}

interface CursorCoordsParam {
  creatorID: number;
}

const DiagramAtomContext = createAtomContext();

export interface RealtimeDiagramContextValue {
  viewerAtom: AtomFactory<ReturnType<typeof Realtime.diagramViewerSelector>, Readonly<ViewerParam>>;
  cursorCoordsAtom: AtomFactory<Point | null, Readonly<CursorCoordsParam>>;
}

export const RealtimeDiagramContext = React.createContext<RealtimeDiagramContextValue | null>(null);

export const RealtimeDiagramProvider = withProvider(DiagramAtomContext.UncontrolledProvider)(({ children }: React.PropsWithChildren<{}>) => {
  const { store } = React.useContext(RealtimeStoreContext);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;

  const viewerAtom = useAtomFactory(
    'diagram.viewer',
    {
      default: ({ creatorID }: Readonly<ViewerParam>) => Realtime.diagramViewerSelector(store.getState(), diagramID, creatorID),
      context: DiagramAtomContext,
    },
    [diagramID]
  );

  const cursorCoordsAtom = useAtomFactory(
    'diagram.cursorCoords',
    {
      default: ({ creatorID }: Readonly<CursorCoordsParam>) => Realtime.cursorCoordsSelector(store.getState(), diagramID, creatorID),
      context: DiagramAtomContext,
    },
    [diagramID]
  );

  const diagramAtoms = useContextApi({
    viewerAtom,
    cursorCoordsAtom,
  });

  React.useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        const viewers = Realtime.diagramViewersSelector(state, diagramID);
        const cursors = Realtime.diagramCursorsSelector(state, diagramID);

        viewers.forEach((viewer) => {
          viewerAtom({ creatorID: viewer.creatorID }).update(viewer);
          cursorCoordsAtom({ creatorID: viewer.creatorID }).update(cursors[viewer.creatorID] ?? null);
        });
      }),
    [diagramID]
  );

  return <RealtimeDiagramContext.Provider value={diagramAtoms}>{children}</RealtimeDiagramContext.Provider>;
}) as React.FC;
