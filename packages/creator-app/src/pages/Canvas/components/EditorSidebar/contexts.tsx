import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import type { NodeData } from '@/models';
import type { Engine } from '@/pages/Canvas/engine';

export interface SidebarHeaderAction {
  value: string;
  label: string;
  onClick: (options: { data: NodeData<unknown>; engine: Engine }) => void;
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

const DEFAULT_SIDEBAR_HEADER_ACTIONS: SidebarHeaderAction[] = [
  {
    value: 'duplicate_block',
    label: 'Duplicate',
    onClick: ({ data, engine }) => engine.node.duplicate(data.nodeID),
  },
  {
    value: 'delete_block',
    label: 'Delete',
    onClick: ({ data, engine }) => engine.node.remove(data.nodeID),
  },
];

export interface SidebarProviderProps {
  headerActions?: SidebarHeaderAction[];
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS, children }) => {
  const [state, updateState] = React.useState({ headerActions });

  const api = useContextApi({ state, updateState });

  return <SidebarContext.Provider value={api}>{children}</SidebarContext.Provider>;
};
