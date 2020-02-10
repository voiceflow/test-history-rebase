import { down } from 'styled-breakpoints';

import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';
import { fadeDownDelayStyles } from '@/styles/animations';

const ModalContainer = styled.section`
  ${flexStyles}
  ${fadeDownDelayStyles}

  position: absolute;
  flex-direction: column;
  border-radius: 5px;
  margin: 28px 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  pointer-events: auto;
  max-width: ${({ isSmall }) => (isSmall ? 500 : 800)}px;
  overflow: hidden;

  ${down('sm')} {
    left: 0;
    top: 0;
    margin: 0.5em;
    max-width: unset;
    width: calc(100% - 1rem);
  }
`;

export default ModalContainer;
