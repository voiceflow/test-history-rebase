import React from 'react';

import { LoadCircle } from '@/components/Loader';

import { Message } from '../components';

const Loading: React.FC = () => (
  <Message iconProps={{ icon: 'alexa' }}>
    <LoadCircle style={{ display: 'block', fontSize: '22px', backgroundSize: '100%' }} />
  </Message>
);

export default Loading;
