import { css, styled, units } from '@ui/styles';

export interface TitleProps {
  fill?: boolean;
  bold?: boolean;
  noMargin?: boolean;
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

  &:not(:last-child) {
    margin-right: ${({ noMargin }) => (noMargin ? 0 : units(1.5))}px;
  }
`;

export default Title;
