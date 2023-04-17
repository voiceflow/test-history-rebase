import { styled } from '@/hocs/styled';

export const UpdateBubble = styled.div`
  position: absolute;
  top: 8px;
  right: 11px;
  z-index: 3;
  box-sizing: content-box;
  width: 5px;
  height: 5px;
  background-color: #e0285b;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 1);
  opacity: 1;
  border-radius: 100%;
`;
