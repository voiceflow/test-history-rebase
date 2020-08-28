import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { Markup, NodeData } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import { HandlePosition } from '../../constants';
import Overlay from '../Overlay';
import { useTransformOverlayAPI } from './hooks';

export type OverlayControlsRenderProps = {
  nodeType: BlockType | null;
  data: NodeData<Markup.AnyNodeData> | null;
  onRotateStart: () => void;
  onResizeStart: (handle: HandlePosition) => () => void;
};

export type OverlayControlsProps = {
  children: (renderProps: OverlayControlsRenderProps) => React.ReactNode;
};

const OverlayControls: React.FC<OverlayControlsProps & ConnectedOverlayControlsProps> = ({ node, children }) => {
  const engine = React.useContext(EngineContext)!;
  const data = node ? engine.getDataByNodeID<Markup.AnyNodeData>(node.nodeID) : null;
  const nodeType = node?.type || null;

  const api = useTransformOverlayAPI(nodeType);

  React.useEffect(() => engine.transformation.register('transformOverlay', api), [api]);

  return (
    <Portal>
      <Overlay ref={api.ref}>{children({ nodeType, data, onResizeStart: api.startResize, onRotateStart: api.startRotate })}</Overlay>
    </Portal>
  );
};

const mapStateToProps = {
  node: Creator.focusedNodeDataSelector,
};

type ConnectedOverlayControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(OverlayControls) as React.FC<OverlayControlsProps>;
