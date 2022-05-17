import { css, styled, transition } from '@/hocs';

import { FORM_SLIDER_WIDTH } from '../..';

export const SECONDARY_SLIDER_WIDTH = 450;

export const Container = styled.div<{ isOpened: boolean }>`
  ${transition('right')}
  position: absolute;
  background: white;
  height: 100%;
  width: ${SECONDARY_SLIDER_WIDTH}px;
  right: -${SECONDARY_SLIDER_WIDTH}px;
  top: 0px;
  border-left: 1px solid #dfe3ed;
  z-index: 2;
  box-shadow: rgb(249 249 249) -5px 0px 30px 0px;

  ${({ isOpened }) =>
    isOpened &&
    css`
      right: ${FORM_SLIDER_WIDTH}px;
    `}
`;

export const BodyContainer = styled.div`
  border-bottom: 1px solid #eaeff4;
  padding-bottom: 26px;
  padding-top: 10px;
`;
