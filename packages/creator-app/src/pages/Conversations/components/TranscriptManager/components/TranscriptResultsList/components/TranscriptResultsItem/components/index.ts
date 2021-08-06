import { colors, Flex } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';
import { ClassName } from '@/styles/constants';

export { default as InfoSection } from './InfoSection';
export { default as OptionButton } from './OptionButton';
export { default as StatusIcons } from './StatusIcons';

const ACTIVE_COLOR = 'rgba(238, 244, 246, 0.60)';
const HOVER_COLOR = 'rgba(238, 244, 246, 0.32)';

export const Container = styled(Flex)<{ active?: boolean; isLastItem: boolean; menuOpen: boolean; id: string }>`
  ${transition()};
  padding: 20px 32px;
  border-left: 3px solid white;
  border-bottom: 1px solid ${({ isLastItem }) => colors(isLastItem ? 'separator' : 'separatorSecondary')};
  border-top: 1px solid transparent;
  border-right: 0px;
  background: white;
  cursor: pointer;
  flex-direction: row;
  position: relative;

  ${({ menuOpen }) =>
    !menuOpen
      ? css`
          & .${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON} {
            display: none;
          }
        `
      : css`
          & .${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON} button span svg {
            color: #2e3852;
          }
        `}

  ${({ active = false }) =>
    active &&
    css`
      border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
      border-top: 1px solid ${({ theme }) => theme.colors.borders};
      border-left: 3px solid ${({ theme }) => theme.colors.blue};
      background: ${ACTIVE_COLOR};
      margin-top: -1px;
      padding-top: 21px;
    `}

  &:hover:not(.active) {
    background: ${HOVER_COLOR};
    border-left: 3px solid ${HOVER_COLOR};
  }

  &:hover {
    & .${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON} {
      display: inline;
    }

    & .${ClassName.TRANSCRIPT_ITEM_STATUSES}-${({ id }) => id} {
      display: none;
    }
  }
`;

export const ReadStatusDot = styled.div<{ read?: boolean }>`
  height: 5px;
  width: 5px;
  background-color: green;
  border-radius: 50%;
  position: relative;
  bottom: 10px;

  ${({ read = false }) =>
    read
      ? css`
          background-color: ${({ theme }) => theme.iconColors.disabled};
        `
      : css`
          background-color: ${({ theme }) => theme.colors.blue};
        `}
`;
