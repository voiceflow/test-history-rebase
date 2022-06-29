import { ButtonVariant, SecondaryButton, SvgIcon } from '@voiceflow/ui';
import styled, { css } from 'styled-components';

const OverflowMenuContainer = styled(SecondaryButton).attrs({ variant: ButtonVariant.SECONDARY })`
  color: rgba(110, 132, 154, 0.85);

  ${({ isActive = false }) =>
    isActive &&
    css`
      ${SvgIcon.Container} {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}

  ${SvgIcon.Container} {
    transition: ${({ theme }) => theme.transition('color')};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

export default OverflowMenuContainer;
