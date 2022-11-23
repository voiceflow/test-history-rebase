import { Box, Input, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

export const IconButtonContainer = styled.div<{ active?: boolean }>`
  ${transition('color, opacity')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 42px;
  height: 42px;
  margin-left: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.iconColors.active};

  &:hover {
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }

  ${SvgIcon.Container} {
    opacity: 0.85;
  }

  ${({ active }) =>
    active &&
    css`
      color: ${({ theme }) => theme.colors.primary};
      opacity: 1;
    `}
`;

export const SearchBox = styled.div`
  ${transition('opacity')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transform-origin: right;
  animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
  width: 250px;
  height: ${({ theme }) => theme.components.menuItem.height};
  box-shadow: 0px 1px 3px 0px rgba(17, 49, 96, 0.06);
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.darkerBlue};
  opacity: 1;
  background-color: ${({ theme }) => theme.colors.white};
  padding-left: 16px;

  div > span {
    opacity: 0.85;
  }

  &:hover {
    div > span {
      opacity: 1;
    }
  }
`;

export const SearchInput = styled(Input)`
  border: none !important;
  background: transparent;
  font-size: 15px;
  box-shadow: none !important;
  padding: 10px 12px 10px 0px;

  input::placeholder {
    line-height: 20px;
  }
`;

export const UpdateBubble = styled(Box.FlexCenter)`
  position: absolute;
  top: -3px;
  right: -1px;
  z-index: 3;
  box-sizing: content-box;
  width: 5px;
  height: 5px;
  background-color: #e0285b;
  border-radius: 100%;
  cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255, 1);
  opacity: 1;
`;
