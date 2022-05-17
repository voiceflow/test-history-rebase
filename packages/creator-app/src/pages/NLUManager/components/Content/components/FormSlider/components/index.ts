import { FlexApart } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const FORM_SLIDER_WIDTH = 460;

export const SliderContainer = styled.div<{ opened: boolean }>`
  ${transition('right')}
  position: absolute;
  display: flex;
  flex-direction: column;
  box-shadow: rgb(249 249 249) -5px 0px 30px 0px;
  height: 100%;
  top: 0px;
  right: -${FORM_SLIDER_WIDTH}px;
  width: ${FORM_SLIDER_WIDTH}px;
  z-index: 3;
  height: 100%;
  background: white;
  border-left: 1px solid #dfe3ed;
  ${({ opened }) =>
    opened &&
    css`
      right: 0;
    `}
`;

export const SliderHeader = styled(FlexApart)`
  border-bottom: solid 1px #eaeff4;
  padding: 20px 32px;
`;
