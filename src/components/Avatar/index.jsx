import React from 'react';

import { Container } from './components';
import { COLORS } from './constants';

const Avatar = ({ url, name, color }) => (
  <Container avatarUrl={url} color={COLORS[color]}>
    {' '}
    {!url && name.toUpperCase().charAt(0)}{' '}
  </Container>
);

export default Avatar;
