import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';

const MarkupShapeNode = <T extends Markup.ShapeNodeData>({ data }: ConnectedMarkupNodeProps<T>) => <div>{data.name}</div>;

export default MarkupShapeNode;
