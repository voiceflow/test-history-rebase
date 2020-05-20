import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';

import { Container } from './components';

const MarkupTextNode: React.FC<ConnectedMarkupNodeProps<Markup.TextNodeData>> = () => <Container />;

export default MarkupTextNode;
