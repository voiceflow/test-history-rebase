import { useContextApi, withProvider } from '@voiceflow/ui';
import React from 'react';

import * as Realtime from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { AtomFactory, useAtomFactory } from '@/hooks/atoms';
import { useSelector } from '@/hooks/redux';

import { createAtomContext } from './AtomContext';
import { RealtimeStoreContext } from './RealtimeStoreContext';

interface ViewerParam {
  tabID: string;
}

const ProjectAtomContext = createAtomContext();

export interface RealtimeProjectContextValue {
  viewerAtom: AtomFactory<ReturnType<ReturnType<typeof Realtime.projectViewerSelector>>, Readonly<ViewerParam>>;
}

export const RealtimeProjectContext = React.createContext<RealtimeProjectContextValue | null>(null);

export const RealtimeProjectProvider = withProvider(ProjectAtomContext.UncontrolledProvider)(({ children }: React.PropsWithChildren<{}>) => {
  const { store } = React.useContext(RealtimeStoreContext);
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const viewerAtom = useAtomFactory('project.viewer', {
    default: ({ tabID }: Readonly<ViewerParam>) => Realtime.projectViewerSelector(store.getState())(projectID, tabID),
    context: ProjectAtomContext,
  });

  const projectAtoms = useContextApi({
    viewerAtom,
  });

  React.useEffect(
    () =>
      store.subscribe(() => {
        const state = store.getState();
        const tabIDs = Realtime.projectViewersTabIDsSelector(state)(projectID);

        tabIDs.forEach(([tabID]) => viewerAtom({ tabID }).update(Realtime.projectViewerSelector(state)(projectID, tabID)));
      }),
    []
  );

  return <RealtimeProjectContext.Provider value={projectAtoms}>{children}</RealtimeProjectContext.Provider>;
}) as React.FC;
