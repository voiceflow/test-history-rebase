import * as Realtime from '@voiceflow/realtime-sdk';
import { Portal } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import { HandlePosition } from '../../constants';
import Overlay from '../Overlay';
import { useTransformOverlayAPI } from './hooks';

export interface OverlayControlsRenderProps {
  data: Realtime.NodeData<Realtime.Markup.AnyNodeData> | null;
  nodeType: BlockType | null;
  onRotateStart: () => void;
  onResizeStart: (handle: HandlePosition) => () => void;
}

export interface OverlayControlsProps {
  children: (renderProps: OverlayControlsRenderProps) => React.ReactNode;
}

const OverlayControls: React.FC<OverlayControlsProps> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const data = useSelector(Creator.focusedNodeDataSelector) as Realtime.NodeData<Realtime.Markup.AnyNodeData> | null;
  const nodeType = data?.type || null;

  const api = useTransformOverlayAPI(nodeType);

  React.useLayoutEffect(() => engine.transformation.register('transformOverlay', api), [api]);

  return (
    <Portal>
      <Overlay ref={api.ref}>{children({ nodeType, data, onResizeStart: api.startResize, onRotateStart: api.startRotate })}</Overlay>
    </Portal>
  );
};

export default OverlayControls;
