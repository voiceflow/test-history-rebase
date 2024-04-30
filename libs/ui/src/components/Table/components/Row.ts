import Divider from '@/components/Divider';
import { css, styled, transition } from '@/styles';

const Row = styled.div<{ active?: boolean; hoverDisabled?: boolean; hovered?: boolean }>`
  ${transition('background-color')};

  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  position: relative;

  ${({ hovered }) => hovered && 'background-color: rgba(238, 244, 246, 0.4);'};

  ${({ onClick, hoverDisabled = false }) =>
    onClick &&
    css`
      cursor: pointer;

      ${!hoverDisabled &&
      css`
        &:hover {
          background-color: rgba(238, 244, 246, 0.4);
        }
      `}

      &:active {
        background-color: rgba(238, 244, 246, 0.65);
      }
    `}

  &:before {
    ${transition('background-color')};
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    content: '';
    pointer-events: none;
  }

  ${({ active, theme }) =>
    active &&
    css`
      background-color: rgba(238, 244, 246, 0.65);

      &:hover {
        background-color: rgba(238, 244, 246, 0.65);
      }

      &:before {
        background-color: ${theme.colors.separator};
      }

      & + ${Divider.S.Simple} {
        background-color: ${theme.colors.separator} !important;
      }
    `}
`;

export default Row;
