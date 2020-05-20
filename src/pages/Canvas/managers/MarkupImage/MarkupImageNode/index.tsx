import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';

import { Container } from './components';

const MarkupImageNode: React.FC<ConnectedMarkupNodeProps<Markup.ImageNodeData>> = ({ data }) => (
  <Container url={data.url} width={data.width} height={data.height} />
);

export default MarkupImageNode;
