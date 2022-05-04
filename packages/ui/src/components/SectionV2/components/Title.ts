import { styled, units } from '@ui/styles';

export interface TitleProps {
  bold?: boolean;
}

const Title = styled.h5<TitleProps>`
  margin: 0;
  font-size: 15px;
  font-weight: ${({ bold }) => (bold ? 600 : 'normal')};

  &:not(:last-child) {
    margin-right: ${units(1.5)}px;
  }
`;

export default Title;
