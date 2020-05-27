import React from 'react';

import { COLORS } from '@/styles/colors';

import { Container } from './components';

const Avatar = ({ url, name, color, noHover }) => (
  <Container avatarUrl={url} color={COLORS[color]} noHover={noHover}>
    {' '}
    {!url && name.toUpperCase().charAt(0)}{' '}
  </Container>
);

export default Avatar;
