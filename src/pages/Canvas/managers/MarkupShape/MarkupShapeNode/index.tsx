import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps, MarkupShapeInstance } from '@/pages/Canvas/components/MarkupNode/types';
import MarkupShape from '@/pages/Canvas/components/MarkupShape';

const MarkupShapeNode: React.ForwardRefRenderFunction<MarkupShapeInstance, ConnectedMarkupNodeProps<Markup.NodeData.Shape>> = ({ data }, ref) => (
  <MarkupShape id={data.nodeID} data={data} ref={ref} />
);

export default React.forwardRef(MarkupShapeNode);
