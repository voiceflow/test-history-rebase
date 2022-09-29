import { styled, units } from '@ui/styles';

export interface TitleProps {
  bold?: boolean;
  noMargin?: boolean;
  secondary?: boolean;
}

const Title = styled.h5<TitleProps>`
  margin: 0;
  font-size: 15px;
  font-weight: ${({ bold }) => (bold ? 600 : 'normal')};
  display: flex;
  flex: 1;
  overflow: hidden;
  align-items: center;
  color: ${({ theme, secondary }) => (secondary ? theme.colors.secondary : '')};

  &:not(:last-child) {
    margin-right: ${({ noMargin }) => (noMargin ? 0 : `${units(1.5)}px`)};
  }
`;

export default Title;
