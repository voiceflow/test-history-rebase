import React from 'react';

import { withHook } from '@/hocs';

import { EngineContext } from './EngineContext';

export const NodeIDContext = React.createContext<string | null>(null);
export const { Provider: NodeIDProvider, Consumer: NodeIDConsumer } = NodeIDContext;

export const useNode = () => {
  const nodeID = React.useContext(NodeIDContext)!;
  const engine = React.useContext(EngineContext)!;

  return engine.dispatcher.useNode(nodeID);
};

export const useNodeData = () => {
  const nodeID = React.useContext(NodeIDContext)!;
  const engine = React.useContext(EngineContext)!;

  return engine.dispatcher.useNodeData(nodeID);
};

export const withNode = withHook(useNode, {
  shouldRender: ({ node }) => !!node,
});

export const withNodeData = withHook(useNodeData);
