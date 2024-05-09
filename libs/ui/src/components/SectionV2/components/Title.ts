import { css, styled } from '@ui/styles';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';

export interface TitleProps extends SpaceProps, LayoutProps {
  fill?: boolean;
  bold?: boolean;
  secondary?: boolean;
}

const Title = styled.h5.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['fill', 'bold', 'secondary'].includes(prop) && defaultValidatorFn(prop),
})<TitleProps>`
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
