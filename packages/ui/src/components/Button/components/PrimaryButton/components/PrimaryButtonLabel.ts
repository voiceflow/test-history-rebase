import { css, styled } from '@ui/styles';

export interface PrimaryButtonLabelProps {
  isLoading?: boolean;
}

const PrimaryButtonLabel = styled.span<PrimaryButtonLabelProps>`
  ${({ isLoading }) =>
    isLoading
      ? css`
          padding: 0 9px;
          pointer-events: none;
        `
      : css`
          padding: 0 22px;
        `}
`;

export default PrimaryButtonLabel;
