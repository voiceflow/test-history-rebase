import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';

interface ContainerProps {
  border?: boolean;
  capitalizeText?: boolean;
  sticky?: boolean;
}

export const Container = styled.header<ContainerProps>`
  ${flexApartStyles}

  width: 100%;
  padding: ${units(2.25)}px ${units(4)}px;
  line-height: normal;
  font-weight: 600;
  color: #132144;
  background-color: #fff;

  ${({ theme, border }) =>
    border &&
    css`
      border-bottom: 1px solid ${theme.colors.separatorSecondary};
    `}

  ${({ capitalizeText = true }) =>
    capitalizeText &&
    css`
      text-transform: capitalize;
    `}

    ${({ sticky }) =>
    sticky
      ? css`
          position: sticky;
          top: 0px;
          z-index: 100;
        `
      : css`
          position: relative;
          z-index: 1;
        `}
`;

export interface TitleProps {
  large?: boolean;
}

export const Title = styled.div<TitleProps>`
  ${({ large }) =>
    large
      ? css`
          font-size: 18px;
          font-weight: 700;
        `
      : css`
          font-size: 15px;
        `}
`;
