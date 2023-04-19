import * as Realtime from '@voiceflow/realtime-sdk';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';
import type Engine from '@/pages/Canvas/engine';

export interface SidebarHeaderAction {
  value: string;
  label: string;
  onClick: (options: { data: Realtime.NodeData<unknown>; engine: Engine }) => void;
}

export interface SidebarContextState {
  headerActions: SidebarHeaderAction[];
}

export interface SidebarContextType {
  state: SidebarContextState;
  updateState: (state: SidebarContextState) => void;
}

export const SidebarContext = React.createContext<null | SidebarContextType>(null);
export const { Consumer: SidebarConsumer } = SidebarContext;

export interface SidebarProviderProps extends React.PropsWithChildren {
  headerActions?: SidebarHeaderAction[];
}

export const DEFAULT_SIDEBAR_HEADER_ACTIONS: SidebarHeaderAction[] = [
  {
    value: 'duplicate_block',
    label: 'Duplicate',
    onClick: ({ data, engine }) => engine.node.duplicateMany([data.nodeID]),
  },
  {
    value: 'delete_block',
    label: 'Delete',
    onClick: ({ data, engine }) => engine.node.remove(data.nodeID),
  },
];

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS, children }) => {
  const [state, updateState] = useLinkedState({ headerActions });

  const api = useContextApi({ state, updateState });

  return <SidebarContext.Provider value={api}>{children}</SidebarContext.Provider>;
};
