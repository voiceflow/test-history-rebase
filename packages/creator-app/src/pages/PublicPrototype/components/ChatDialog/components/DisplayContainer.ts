/* eslint-disable no-nested-ternary */

import { styled } from '@/hocs/styled';

import { DESKTOP_INPUT_CONTAINER_HEIGHT, MOBILE_INPUT_CONTAINER_HEIGHT } from './InputContainer';

const DisplayContainer = styled.div<{ isMobile?: boolean; noPadding?: boolean }>`
  display: flex;
  position: relative;
  height: ${({ isMobile }) => `calc(100% - ${isMobile ? MOBILE_INPUT_CONTAINER_HEIGHT : DESKTOP_INPUT_CONTAINER_HEIGHT}px)`};
`;

export default DisplayContainer;
