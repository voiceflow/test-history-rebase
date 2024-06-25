import { css, styled } from '@ui/styles';
import type { SpaceProps } from 'styled-system';
import { space } from 'styled-system';

enum Sizes {
  sm = '40px',
  md = '64px',
}

export interface BaseFrameStylesProps extends SpaceProps {
  size: keyof typeof Sizes;
}

const baseFrameStyles = css<BaseFrameStylesProps>`
  width: ${({ size }) => Sizes[size]};
  height: ${({ size }) => Sizes[size]};
  border-radius: 8px;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.12);
`;

export interface ContainerProps extends SpaceProps {}

export const Container = styled.div<ContainerProps>`
  ${space}
`;
export interface ImageProps extends BaseFrameStylesProps {
  src: string;
}

export const Image = styled.div<ImageProps>`
  ${baseFrameStyles}
  background: ${({ src }) => `url(${src}) no-repeat center center`};
  background-size: cover;
`;

export const Placeholder = styled.div<BaseFrameStylesProps>`
  overflow: hidden;
  position: relative;

  ${baseFrameStyles}

  &:before {
    content: '';
    display: block;
    position: absolute;
    background-color: rgb(93 157 245 / 50%);
    width: 50%;
    height: 50%;
  }
  &:after {
    content: '';
    display: block;
    right: 0;
    bottom: 0;
    position: absolute;
    background-color: rgb(93 157 245 / 50%);
    width: 50%;
    height: 50%;
  }
`;
