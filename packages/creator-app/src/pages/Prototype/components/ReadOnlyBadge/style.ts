import { Flex, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Container = styled(Flex)<{ runBlink: boolean }>`
  ${transition('color')}
  color: #8da2b5;
  flex-direction: row;
  position: absolute;
  bottom: 12px;
  right: 425px;
  padding: 10px;
  z-index: 1;

  ${SvgIcon.Container} {
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

      ${SvgIcon.Container} {
        color: ${theme.colors.blue};
      }
    `}

  & > span {
    font-size: 12px;

    font-weight: 500;
  }
`;
