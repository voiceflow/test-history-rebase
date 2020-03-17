import { down } from 'styled-breakpoints';

import { styled } from '@/hocs';
import { fadeDownDelayStyles } from '@/styles/animations';

export type ModalContainerProps = {
  fade: boolean;
  isSmall?: boolean;
  isOpened?: boolean;
};

const ModalContainer = styled.section<ModalContainerProps>`
  ${({ fade }) => fade && fadeDownDelayStyles}

  border-radius: 5px;
  margin: 28px auto;
  width: 100%;
  background: #fff;
  max-width: ${({ isSmall }) => (isSmall ? 500 : 780)}px;
  overflow: hidden;
  z-index: 1000;

  ${down('sm')} {
    left: 0;
    top: 0;
    margin: 0.5em auto;
    max-width: unset;
    width: calc(100% - 1rem);
  }
`;

export default ModalContainer;
