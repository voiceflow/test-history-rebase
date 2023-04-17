import { styled } from '@/hocs/styled';

const SelectionArea = styled.div`
  position: absolute;
  display: none;
  border: 1px solid #5d9df5;
  background: #5d9df515;
  pointer-events: none;
  border-radius: 5px;
  will-change: left, top, width, height;
  z-index: 11;
`;

export default SelectionArea;
