import type { ButtonContainerProps } from '@/components/Button/components/ButtonContainer';
import ButtonContainer from '@/components/Button/components/ButtonContainer';
import SvgIcon from '@/components/SvgIcon';
import { css, styled, transition } from '@/styles';

export interface ContainerProps extends ButtonContainerProps {
  rounded?: boolean;
  isActive?: boolean;
  tiny?: boolean;
}

export const Icon = styled(SvgIcon)`
  ${transition('color')}
  color: rgba(110, 132, 154, .85);
`;

const activeStyles = css`
  background-color: #f7f7f7;
  color: #132144;
  box-shadow:
    0 0 0 1px rgba(19, 33, 68, 0.08),
    0 2px 2px 0 rgba(19, 33, 68, 0.02),
    0 2px 4px 0 rgba(19, 33, 68, 0.02),
    0 2px 8px 0 rgba(19, 33, 68, 0.04);

  & ${Icon} {
    color: #132144 !important;
  }
`;

export const Container = styled(ButtonContainer)<ContainerProps>`
  ${transition('all')}
  border-radius: ${({ rounded }) => (rounded ? '50%' : '10px')};
  color: #132144;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  gap: 20px;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow:
    0px 1px 3px 0px rgb(19, 33, 68, 0.04),
    0px 1px 1px 0px rgb(19, 33, 68, 0.01),
    0px 1px 0px 0px rgb(19, 33, 68, 0.03),
    0px 0px 0px 1px rgb(19, 33, 68, 0.06);
  cursor: pointer;

  &:hover {
    box-shadow:
      rgba(19, 33, 68, 0.06) 0px 0px 0px 1px,
      rgba(19, 33, 68, 0.03) 0px 1px 0px 0px,
      rgba(19, 33, 68, 0.01) 0px 1px 1px 0px,
      rgba(19, 33, 68, 0.01) 0px 2px 2px 0px,
      rgba(19, 33, 68, 0.02) 0px 4px 4px 0px,
      rgba(19, 33, 68, 0.04) 0px 4px 8px 0px;

    & ${Icon} {
      color: rgba(110, 132, 154, 1);
    }
  }

  &:active {
    ${activeStyles}
  }

  ${({ isActive }) => isActive && activeStyles}

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      box-shadow: none;
      opacity: 0.4;

      & ${Icon} {
        opacity: 0.46;
      }
    `}

    ${({ tiny }) =>
    tiny &&
    css`
      min-width: 24px;
      height: 24px;
      padding: 0;
      gap: 0;
      border-radius: 50%;
      z-index: 30;
      position: absolute;
    `}
`;

export const Label = styled.span`
  font-weight: 600;
  letter-spacing: 0.2px;
`;
