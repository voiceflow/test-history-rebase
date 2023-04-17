import { css, styled, transition } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

export interface ContainerProps extends SpaceProps {
  small?: boolean;
  large?: boolean;
  medium?: boolean;
  squareRadius?: boolean;
}

const sizes = {
  small: css`
    width: 18px;
    height: 18px;
    font-size: 13px;
    line-height: 18px;
  `,
  medium: css`
    width: 32px;
    height: 32px;
    font-size: 16px;
    line-height: 32px;
  `,
  large: css`
    width: 42px;
    height: 42px;
    font-size: 18px;
    line-height: 42px;
  `,
};

export const Container = styled.div<ContainerProps>`
  ${transition('color', 'border')}
  ${space};

  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-align: center;
  color: #becedc;
  position: relative;
  background-color: #fff;
  background-position: center center;
  background-size: cover;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
  border-radius: ${({ squareRadius }) => (squareRadius ? '8px' : `100%`)};
  flex-shrink: 0;
  cursor: default;

  ${({ small }) => small && sizes.small}
  ${({ medium }) => medium && sizes.medium}
  ${({ large }) => large && sizes.large}

  & > * {
    display: inline-block;
  }
`;
