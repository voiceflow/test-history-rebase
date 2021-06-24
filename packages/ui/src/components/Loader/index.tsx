import cn from 'classnames';
import React from 'react';

import { loader2Icon } from '../../assets';
import { css, styled } from '../../styles';
import { ClassName } from '../../styles/constants';

type LoaderProps = {
  isMd?: boolean;
  color?: string;
  borderLess?: boolean;
  className?: string;
};

const spinnerStyles = css<LoaderProps>`
  display: inline-flex;
  width: 1em;
  height: 1em;
  font-size: ${({ isMd }) => (isMd ? '2rem' : '4rem')};
  border-radius: 50%;
`;

const LoadContainer = styled.div<LoaderProps>`
  ${spinnerStyles}
  margin-bottom: 20px;
  box-shadow: ${({ isMd, borderLess }) => (isMd || borderLess ? 'none' : '0 1px 2px 0 rgba(17, 49, 96, 0.24);')};
`;

export const LoadCircle = styled.span<LoaderProps>`
  ${spinnerStyles}
  line-height: 1;
  background-color: ${({ color }) => color || '#fff'};
  background-image: url(${loader2Icon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75%;
  animation: spin 1s linear infinite;
`;

const Loader: React.FC<LoaderProps> = ({ className, ...props }) => (
  <LoadContainer className={cn(ClassName.LOADER, className)} {...props}>
    <LoadCircle color={props.color} />
  </LoadContainer>
);

export default React.memo(Loader);
