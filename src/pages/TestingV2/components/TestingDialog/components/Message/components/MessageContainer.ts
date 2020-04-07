import { Container as SvgIconContainer } from '@/components/SvgIcon';
import { css, styled, units } from '@/hocs';

import Bubble from './MessageBubble';

const Container = styled.div<{ rightAlign?: boolean }>`
  display: flex;
  align-items: flex-end;
  margin-top: ${units(1)}px;

  ${({ rightAlign = false }) =>
    rightAlign
      ? css`
          flex-direction: row-reverse;

          & > ${SvgIconContainer} {
            margin-bottom: 2px;
            margin-left: 8px;
          }

          ${Bubble} {
            border-bottom-right-radius: 5px;
          }
        `
      : css`
          & > ${SvgIconContainer} {
            margin-right: 8px;
            margin-bottom: 2px;
          }

          ${Bubble} {
            border-bottom-left-radius: 5px;
          }
        `}
`;

export default Container;
