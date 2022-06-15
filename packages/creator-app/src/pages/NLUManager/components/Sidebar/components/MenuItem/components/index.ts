import { FlexApart, IconButton, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const Container = styled(FlexApart)<{ active?: boolean }>`
  ${transition('background')}
  padding: 7px 12px 7px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  display: flex;
  margin-bottom: 4px;
  background: transparent;
  border: solid 1px transparent;

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
      border: solid 1px #dfe3ed;
    `}

  ${SvgIcon.Container} {
    opacity: 0.85;
    align-self: center;
  }

  &:hover {
    background: #eef4f6;
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }

  &:active {
    border: solid 1px #dfe3ed;
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }
`;

export const AddButton = styled(IconButton)<{ isVisible: boolean }>`
  ${transition('opacity')};
  opacity: 0;

  ${({ isVisible }) =>
    isVisible
      ? css`
          opacity: 1;
        `
      : css`
          pointer-events: none;
        `}
`;
