import { styled, transition } from '@/hocs';

const ActiveLine = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  overflow: hidden;
  height: 2px;
  background-color: ${({ color }) => color || '#5d9df5'};
  will-change: width, transform;
  ${transition('transform', 'width')};
`;

export default ActiveLine;
