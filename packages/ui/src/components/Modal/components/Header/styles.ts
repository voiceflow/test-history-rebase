import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';

interface ContainerProps {
  border?: boolean;
  capitalizeText?: boolean;
}

export const Container = styled.header<ContainerProps>`
  ${flexApartStyles}

  width: 100%;
  padding: ${units(2.5)}px ${units(4)}px;
  position: relative;
  font-weight: 600;
  z-index: 1;
  color: #132144;

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
`;
