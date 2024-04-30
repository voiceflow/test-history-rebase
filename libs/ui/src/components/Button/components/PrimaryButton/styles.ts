import type { ButtonContainerProps } from '@/components/Button/components/ButtonContainer';
import ButtonContainer from '@/components/Button/components/ButtonContainer';
import { FlexCenter } from '@/components/Flex';
import { colors, css, styled, ThemeColor, transition } from '@/styles';

export interface PrimaryButtonContainerProps extends ButtonContainerProps {
  isActive?: boolean;
}

export interface PrimaryButtonLabelProps {
  isLoading?: boolean;
}

export const PrimaryButtonIcon = styled(FlexCenter)`
  width: 30px;
  height: 30px;
  margin-right: 6px;
  padding: 7px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
`;

const activeStyles = css`
  background-color: #2f75d6;
`;

export const PrimaryButtonContainer = styled(ButtonContainer)<PrimaryButtonContainerProps>`
  ${transition('background-color', 'opacity', 'box-shadow')}
  color: ${colors(ThemeColor.WHITE)};
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  background-color: #3d82e2;
  background-size: 1px 52px;
  box-shadow:
    inset 0px -1px 0px 1px rgba(19, 33, 68, 0.08),
    0px 1px 3px 0px rgba(19, 33, 68, 0.16),
    0px 0px 1px 0px rgba(19, 33, 68, 0.08),
    0px 1px 1px 0px rgba(19, 33, 68, 0.1);
  border-radius: 10px;

  ${({ disabled, isActive }) =>
    disabled
      ? css`
          box-shadow: none;
          background-color: rgba(61, 130, 226, 0.4);
          box-shadow: inset 0px -2px 0px rgba(19, 33, 68, 0.06);

          & ${PrimaryButtonIcon} {
            opacity: 0.46;
          }
        `
      : isActive && activeStyles}

  &:hover {
    ${activeStyles}
  }
`;

export const PrimaryButtonLabel = styled.span<PrimaryButtonLabelProps>`
  ${({ isLoading }) =>
    isLoading
      ? css`
          padding: 0 9px;
          pointer-events: none;
        `
      : css`
          padding: 0 20px;
        `}
`;
