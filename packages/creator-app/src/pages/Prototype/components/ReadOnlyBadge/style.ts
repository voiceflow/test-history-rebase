import Flex from '@/components/Flex';
import SvgIconContainer from '@/components/SvgIcon/components/SvgIconContainer';
import { css, styled, transition } from '@/hocs';

export const Container = styled(Flex)<{ runBlink: boolean }>`
  ${transition('color')}
  color: #8da2b5;
  flex-direction: row;
  position: absolute;
  bottom: 12px;
  right: 425px;
  padding: 10px;
  z-index: 1;

  ${SvgIconContainer} {
    ${transition('color')}
    display: inline-block;
    margin-right: 8px;
    position: relative;
    top: 4px;
  }

  ${({ runBlink, theme }) =>
    runBlink &&
    css`
      color: ${theme.colors.blue};

      ${SvgIconContainer} {
        color: ${theme.colors.blue};
      }
    `}

  & > span {
    font-size: 12px;

    font-weight: 500;
  }
`;
