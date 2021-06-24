import { css, styled } from '../../../../../styles';

export { default as PrimaryButtonContainer } from './PrimaryButtonContainer';
export { default as PrimaryButtonIcon } from './PrimaryButtonIcon';

export type PrimaryButtonLabelProps = {
  isLoading?: boolean;
};

export const PrimaryButtonLabel = styled.span<PrimaryButtonLabelProps>`
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
