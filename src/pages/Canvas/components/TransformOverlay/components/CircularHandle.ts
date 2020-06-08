import { styled } from '@/hocs';

const CircularHandle = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  width: 7px;
  height: 7px;
  background: #fff;
  z-index: 110;
  pointer-events: all;
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.16);
  transform: translateX(-50%);
  cursor: grab;

  :active {
    cursor: grabbing;
  }
`;

export default CircularHandle;
