import { useContextApi, withProvider } from '@voiceflow/ui';
import React from 'react';

import { createAtomContext } from './AtomContext';

const ProjectAtomContext = createAtomContext();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RealtimeProjectContextValue {}

export const RealtimeProjectContext = React.createContext<RealtimeProjectContextValue | null>(null);

export const RealtimeProjectProvider = withProvider(ProjectAtomContext.UncontrolledProvider)(({ children }: React.PropsWithChildren<{}>) => {
  const projectAtoms = useContextApi({});

  return <RealtimeProjectContext.Provider value={projectAtoms}>{children}</RealtimeProjectContext.Provider>;
}) as React.FC;
