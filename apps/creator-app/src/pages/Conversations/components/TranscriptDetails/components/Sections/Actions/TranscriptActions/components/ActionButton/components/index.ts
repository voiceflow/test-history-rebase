import { transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const ActionIcon = styled.div<{ selected?: boolean | undefined; left?: number }>`
  position: relative;
  top: 3px;
  ${({ selected }) =>
    selected
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0.6;
        `}

  ${({ left }) =>
    left &&
    css`
      left: ${left}px;
    `}
`;

export const ActionContainer = styled.div<{ selected?: boolean | undefined }>`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 11px 32px 11px 18px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -18px;

  :hover {
    background-color: rgba(238, 244, 246, 0.85);
    ${transition('background-color')}
    ${ActionIcon} {
      opacity: 0.8;
    }

  :active {
    transition: all 0.15s ease;
     ${ActionIcon} {
      opacity: 1;
    }
  }

    ${({ selected }) =>
      selected &&
      css`
        ${ActionIcon} {
          opacity: 1;
        }
      `}
`;

export const ActionLabel = styled.div`
  white-space: nowrap;
`;
