import React from 'react';

import { CanvasAPI } from '@/components/Canvas/types';
import { FeatureFlag } from '@/config/features';
import { withContext } from '@/hocs';
import { LockOwnerType, Node, NodeData } from '@/models';
import { MergeLayerAPI, NodeAPI, PortAPI } from '@/pages/Canvas/types';
import { AnyAction } from '@/store/types';

export type Engine = {
  getLinkIDsByPortID: (portID: string) => string[];
  hasLinksByNodeID: (nodeID: string) => boolean;
  getNodeByID: (nodeID: string) => Node;
  isFeatureEnabled: (featureID: FeatureFlag) => boolean;
  isBlockRedesignEnabled: () => boolean;

  registerPort: (portID: string, api: PortAPI) => void;
  expirePort: (portID: string, instanceID: string) => void;

  registerNode: (nodeID: string, api: NodeAPI) => void;
  expireNode: (nodeID: string, instanceID: string) => void;

  isNodeMovementLocked: (nodeID: string) => boolean;
  setActivation: (nodeID: string) => void;

  updateViewport: (x: number, y: number, zoom: number) => void;
  getCanvasMousePosition: () => [number, number];

  link: {
    remove: (linkID: string) => Promise<void>;
    add: (sourcePortID: string, targetPortID: string) => Promise<void>;
  };

  node: {
    center: (nodeID: string) => void;
    updateData: (nodeID: string, data: Partial<NodeData<unknown>>) => void;
    insertNested: (parentNodeID: string, index: number, nodeID: string) => Promise<void>;
    redrawNestedLinks: (parentNodeID: string) => void;
  };

  focus: {
    set: (nodeID: string, options: { renameActiveRevision: string }) => void;
    isTarget: (nodeID: string) => boolean;
  };

  selection: {
    isTarget: (nodeID: string) => boolean;
  };

  drag: {
    hasTarget: boolean;
    target: string | null;
    set: (nodeID: string) => Promise<void>;
    reset: () => Promise<void>;
  };

  mergeV2: {
    mergeLayer: MergeLayerAPI | null;

    registerMergeLayer: (api: MergeLayerAPI | null) => void;
    updateCandidates: () => void;
    unmerge: () => Promise<void>;
    reset: () => void;
  };

  dispatcher: {
    usePort: (portID: string) => { portID: string; port: unknown; hasActiveLinks: boolean };
    useNode: (nodeID: string) => { nodeID: string; node: Node; isHighlighted: boolean; lockOwner: LockOwnerType };
    useNodeData: (nodeID: string) => { nodeID: string; data: NodeData<unknown> };
  };

  realtime: {
    panViewport: (movementX: number, movementY: number) => void;
    zoomViewport: (moveZ: number) => void;
    sendVolatileUpdate: (action: AnyAction) => void;
  };

  linkCreation: {
    isDrawing: boolean;
    hasPin: boolean;
    sourcePortID: string | null;

    pin: (targetPortID: string, position: [number, number]) => void;
    unpin: () => void;
    isSourceNode: (nodeID: string) => boolean;
    containsSourcePort: (nodeID: string) => boolean;
    getLinkPoints: () => [[number, number], [number, number]];
    start: (sourceePortID: string, origin: [number, number]) => void;
    complete: (targetPortID: string) => void;
    abort: () => void;
  };

  canvas: CanvasAPI;
};

export const EngineContext = React.createContext<Engine | null>(null);
export const { Provider: EngineProvider, Consumer: EngineConsumer } = EngineContext;

export const withEngine = withContext(EngineContext, 'engine');
