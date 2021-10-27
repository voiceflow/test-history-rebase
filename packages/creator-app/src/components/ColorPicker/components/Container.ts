import { styled } from '@/hocs';

const Container = styled.div<{ width?: number }>`
  display: flex;
  width: ${({ width = 215 }) => `${width}px`};
  flex-direction: column;
  background-color: #f6f6f6;
`;

export default Container;
