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
  border-left: 3px solid white;
  border-bottom: 1px solid #eaeff4;
  border-top: 1px solid transparent;
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
      border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
      border-top: 1px solid ${({ theme }) => theme.colors.borders};
      border-left: 3px solid ${COLOR_BLUE};
      background: ${ACTIVE_COLOR};
      margin-top: -1px;
      padding-top: 21px;
    `}

  &:hover {
    background: ${ACTIVE_COLOR};

    & .${ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON} {
      display: inline;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);

      :hover {
        box-shadow: none;
      }
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
          background-color: ${COLOR_BLUE};
        `
      : css`
          background-color: #becedc;
        `}
`;
