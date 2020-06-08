import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';

const MarkupShapeNode = <T extends Markup.ShapeNodeData>({ data }: ConnectedMarkupNodeProps<T>, ref: React.Ref<HTMLDivElement>) => (
  <div ref={ref}>{data.name}</div>
);

export default React.forwardRef<HTMLDivElement, ConnectedMarkupNodeProps<any>>(MarkupShapeNode);
