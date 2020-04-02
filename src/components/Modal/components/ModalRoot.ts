import { css, styled } from '@/hocs';

const ModalRoot = styled.div`
  position: fixed;
  padding: 0 0.5rem;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: auto;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  ${({ hidden }) =>
    hidden &&
    css`
      width: 0;
      height: 0;
      position: fixed;
      top: 0%;
      left: 0%;
      z-index: -1000;
      opacity: 0;
      overflow: hidden;
    `}
`;

export default ModalRoot;
