import Flex from '@/components/Flex';
import { css, styled, transition } from '@/hocs';
import { ClassName } from '@/styles/constants';
import { COLOR_BLUE } from '@/styles/theme/constants';

export { default as InfoSection } from './InfoSection';
export { default as StatusIcons } from './StatusIcons';

const ACTIVE_COLOR = 'rgba(238, 244, 246, 0.85)';

export const Container = styled(Flex)<{ active?: boolean; menuOpen: boolean; id: string }>`
  ${transition()};
  padding: 20px 32px;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
  border-left: 3px solid white;
  border-right: 0px;
  background: white;
  cursor: pointer;
  flex-direction: row;
  position: relative;

  ${({ menuOpen }) =>
    !menuOpen &&
    css`
      & .${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON} {
        display: none;
      }
    `}

  ${({ active = false }) =>
    active &&
    css`
      border-left: 3px solid ${COLOR_BLUE};
      background: ${ACTIVE_COLOR};
    `}

  &:hover {
    background: ${ACTIVE_COLOR};

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
  position: absolute;
  top: 30px;

  ${({ read = false }) =>
    read
      ? css`
          background-color: ${COLOR_BLUE};
        `
      : css`
          background-color: #becedc;
        `}
`;
