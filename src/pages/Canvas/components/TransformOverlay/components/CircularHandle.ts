import { styled } from '@/hocs';

const CircularHandle = styled.div`
  position: absolute;
  width: 7px;
  height: 7px;
  background: #fff;
  z-index: 109;
  pointer-events: all;
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.16);

  cursor: grab;

  :active {
    cursor: grabbing;
  }

  &:before {
    display: block;
    position: absolute;
    top: 7px;
    left: 3px;
    width: 1px;
    height: 13px;
    background-color: rgba(98, 119, 140, 0.5);

    content: '';
  }
`;

export default CircularHandle;
