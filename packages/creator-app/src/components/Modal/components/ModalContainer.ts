import { down } from 'styled-breakpoints';

import { styled } from '@/hocs';
import { FadeDownDelayed } from '@/styles/animations';

export interface ModalContainerProps {
  fade: boolean;
  centered?: boolean;
  maxWidth?: number;
  isOpened?: boolean;
}

const ModalContainer = styled.section<ModalContainerProps>`
  ${({ fade }) => fade && FadeDownDelayed}

  display: flex;
  flex-direction: row;
  border-radius: 5px;
  margin: ${({ centered }) => (centered ? 'auto' : '28px auto')};
  width: 100%;
  max-height: calc(100% - 56px);
  background: #fff;
  max-width: ${({ maxWidth = 500 }) => maxWidth}px;
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
