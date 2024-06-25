import { styled } from '@/hocs/styled';

const LeftEdge = styled.div`
  width: 100px;
  height: 100px;
  left: 10px;
  top: 12px;
  border-radius: 20px;
  transform: rotate(20deg);
  background-color: white;
  position: absolute;
  z-index: -1;
  box-shadow:
    0 0 3px 0 rgba(17, 49, 96, 0.08),
    0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export default LeftEdge;
