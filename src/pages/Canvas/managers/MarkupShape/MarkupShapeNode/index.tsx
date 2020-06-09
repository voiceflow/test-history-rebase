import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import MarkupShape from '@/pages/Canvas/components/MarkupShape';

const MarkupShapeNode: React.FC<ConnectedMarkupNodeProps<Markup.NodeData.Shape>> = ({ data }) => <MarkupShape id={data.nodeID} data={data} />;

export default React.forwardRef<HTMLDivElement, ConnectedMarkupNodeProps<any>>(MarkupShapeNode);
