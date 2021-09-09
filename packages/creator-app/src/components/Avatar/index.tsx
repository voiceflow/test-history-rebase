import React from 'react';

import { COLORS } from '@/styles/colors';

import { Container } from './components';

export interface AvatarProps {
  className?: string;
  url: string;
  name?: string;
  color?: keyof typeof COLORS;
  noHover?: boolean;
  noShadow?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ className, url, name, color, noHover, noShadow }) => (
  <Container className={className} avatarUrl={url} rgbColor={color ? COLORS[color] : null} noHover={noHover} noShadow={noShadow}>
    {' '}
    {!url && name?.toUpperCase().charAt(0)}{' '}
  </Container>
);

export default Avatar;
