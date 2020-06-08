import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';

import { Container } from './components';

const MarkupImageNode: React.RefForwardingComponent<HTMLDivElement, ConnectedMarkupNodeProps<Markup.ImageNodeData>> = ({ data }, ref) => (
  <Container url={data.url} width={data.width} height={data.height} ref={ref} />
);

export default React.forwardRef(MarkupImageNode);
