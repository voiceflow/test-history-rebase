import { down } from 'styled-breakpoints';

import { css, styled } from '@/hocs';
import { FadeDownDelayed } from '@/styles/animations';

export interface ModalContainerProps {
  fade: boolean;
  centered?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  verticalMargin?: number;
  isOpened?: boolean;
  fullScreen?: boolean;
}

const ModalContainer = styled.section<ModalContainerProps>`
  ${({ fade }) => fade && FadeDownDelayed}

  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin: ${({ verticalMargin = 28, centered }) => (centered ? 'auto' : `${verticalMargin}px auto;`)};
  width: 100%;
  max-height: calc(100% - 56px);
  background: #fff;

  ${({ fullScreen }) =>
    fullScreen &&
    css`
      height: 100% !important;
      width: 100% !important;
      max-height: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 0;
    `};

  max-width: ${({ maxWidth = 500 }) => maxWidth}px;
  max-height: ${({ maxHeight }) =>
    maxHeight &&
    css`
      ${maxHeight}px
    `};

  overflow-x: hidden;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.modal};
  pointer-events: all;

  ${down('sm')} {
    left: 0;
    top: 0;
    margin: 0.5em auto;
    max-width: unset;
    width: calc(100% - 1rem);
  }
`;

export default ModalContainer;
