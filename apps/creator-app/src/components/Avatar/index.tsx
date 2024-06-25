import React from 'react';

import { COLORS } from '@/styles/colors';

import * as S from './styles';

export interface AvatarProps {
  className?: string;
  url?: string | null;
  name?: string;
  color?: keyof typeof COLORS;
  noHover?: boolean;
  noShadow?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ className, url, name, color, noHover, noShadow }) => (
  <S.Container
    className={className}
    avatarUrl={url}
    rgbColor={color ? COLORS[color] : null}
    noHover={noHover}
    noShadow={noShadow}
  >
    {' '}
    {!url && name?.toUpperCase().charAt(0)}{' '}
  </S.Container>
);

export default Avatar;
