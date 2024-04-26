import { css, styled } from '@ui/styles';
import type { LayoutProps, SpaceProps } from 'styled-system';
import { layout, space } from 'styled-system';

export interface TitleProps extends SpaceProps, LayoutProps {
  fill?: boolean;
  bold?: boolean;
  secondary?: boolean;
}

const Title = styled.h5<TitleProps>`
  margin: 0;
  display: flex;
  font-size: 15px;
  font-weight: ${({ bold }) => (bold ? 600 : 'normal')};
  overflow: hidden;
  align-items: center;
  color: ${({ theme, secondary }) => (secondary ? theme.colors.secondary : '')};

  ${({ fill = true }) =>
    fill &&
    css`
      flex: 1;
    `};

  ${space};
  ${layout};
`;

export default Title;
