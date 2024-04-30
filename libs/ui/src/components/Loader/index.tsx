import cn from 'classnames';
import React from 'react';

import { loader2Icon, spinnerSmall } from '@/assets';
import type { StyledProps } from '@/styles';
import { colors, css, styled, ThemeColor } from '@/styles';
import { spinKeyframes } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

export interface LoaderProps {
  isMd?: boolean;
  color?: string;
  borderLess?: boolean;
  className?: string;
  style?: StyledProps<any>;
}

const spinnerStyles = css<LoaderProps>`
  display: inline-flex;
  font-size: ${({ isMd }) => (isMd ? '2rem' : '4rem')};
  border-radius: 50%;
`;

export const LoadContainer = styled.div<LoaderProps>`
  ${spinnerStyles}
  margin-bottom: 20px;
  box-shadow: ${({ isMd, borderLess }) => (isMd || borderLess ? 'none' : '0 1px 2px 0 rgba(17, 49, 96, 0.24);')};
`;

export const LoadCircle = styled.span<LoaderProps>`
  ${spinnerStyles}
  width: 1em;
  height: 1em;
  line-height: 1;
  background-color: ${({ color }) => color || colors(ThemeColor.WHITE)};
  background-image: url(${loader2Icon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

export const LoadCircleSmall = styled.span<LoaderProps>`
  ${spinnerStyles}
  width: 1em;
  height: 1em;
  line-height: 1;
  background-color: ${({ color }) => color || colors(ThemeColor.WHITE)};
  background-image: url(${spinnerSmall});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

const Loader: React.FC<LoaderProps> = ({ className, ...props }) => (
  <LoadContainer className={cn(ClassName.LOADER, className)} {...props}>
    <LoadCircle color={props.color} {...props} />
  </LoadContainer>
);

export default React.memo(Loader);
