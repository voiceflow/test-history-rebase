import Divider from '@ui/components/Divider';
import { css, styled, transition } from '@ui/styles';

const Row = styled.div<{ active?: boolean }>`
  ${transition('background-color')};

  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  position: relative;

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      &:hover {
        background-color: rgba(238, 244, 246, 0.3);
      }

      &:active {
        background-color: rgba(238, 244, 246, 0.5);
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
      background-color: rgba(238, 244, 246, 0.5);

      &:hover {
        background-color: rgba(238, 244, 246, 0.5);
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
