import React from 'react';

export const SidebarContext = React.createContext(null);
export const { Consumer: SidebarConsumer } = SidebarContext;

const DEFAULT_SIDEBAR_HEADER_ACTIONS = [
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

export const SidebarProvider = ({ headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS, children }) => {
  const [state, updateState] = React.useState({ headerActions });

  return <SidebarContext.Provider value={{ state, updateState }}>{children}</SidebarContext.Provider>;
};
