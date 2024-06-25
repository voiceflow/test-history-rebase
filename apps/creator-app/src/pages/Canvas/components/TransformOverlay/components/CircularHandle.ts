import { styled } from '@/hocs/styled';

const CircularHandle = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 109;
  pointer-events: all;
  border-radius: 50%;

  cursor: grab;

  :active {
    cursor: grabbing;
  }

  &:before {
    display: block;
    position: absolute;
    top: 11px;
    left: 8px;
    width: 1px;
    height: 13px;
    background-color: rgba(98, 119, 140, 0.5);
    transform: translateX(-0.5px);

    content: '';
  }

  &:after {
    display: block;
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow:
      0 1px 3px 0 rgba(19, 33, 68, 0.08),
      0 0 1px 1px rgba(17, 49, 96, 0.16);

    content: '';
  }
`;

export default CircularHandle;
