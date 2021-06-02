import React from 'react';

import { COLORS } from '@/styles/colors';

import { Container } from './components';

const Avatar = ({ className, url, name, color, noHover, noShadow }) => (
  <Container className={className} avatarUrl={url} color={COLORS[color]} noHover={noHover} noShadow={noShadow}>
    {' '}
    {!url && name.toUpperCase().charAt(0)}{' '}
  </Container>
);

export default Avatar;
