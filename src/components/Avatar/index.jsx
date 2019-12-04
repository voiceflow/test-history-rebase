import React from 'react';

import { COLORS } from '@/styles/colors';

import { Container } from './components';

const Avatar = ({ url, name, color }) => (
  <Container avatarUrl={url} color={COLORS[color]}>
    {' '}
    {!url && name.toUpperCase().charAt(0)}{' '}
  </Container>
);

export default Avatar;
