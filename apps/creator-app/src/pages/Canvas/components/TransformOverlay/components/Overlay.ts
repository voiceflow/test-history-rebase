import { styled } from '@/hocs/styled';

const Overlay = styled.div`
  display: none;
  position: fixed;
  z-index: 100;
  padding: 1px;
  border: solid 1px rgba(98, 119, 140, 0.5);
  pointer-events: none;
  z-index: 0;
`;

export default Overlay;
