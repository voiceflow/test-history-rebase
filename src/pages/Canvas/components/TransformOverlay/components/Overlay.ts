import { styled } from '@/hocs';

const Overlay = styled.div`
  display: none;
  position: fixed;
  z-index: 100;
  border: solid 1px rgba(98, 119, 140, 0.5);
  pointer-events: none;
`;

export default Overlay;
