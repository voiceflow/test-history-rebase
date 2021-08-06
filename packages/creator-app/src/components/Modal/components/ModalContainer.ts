import { down } from 'styled-breakpoints';

import { styled } from '@/hocs';
import { FadeDownDelayed } from '@/styles/animations';

export interface ModalContainerProps {
  fade: boolean;
  isSmall?: boolean;
  isOpened?: boolean;
}

const ModalContainer = styled.section<ModalContainerProps>`
  ${({ fade }) => fade && FadeDownDelayed}

  border-radius: 5px;
  margin: 28px auto;
  width: 100%;
  max-height: calc(100% - 56px);
  background: #fff;
  max-width: ${({ isSmall }) => (isSmall ? 500 : 780)}px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1000;
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
