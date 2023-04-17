import { styled } from '@/hocs/styled';

const Container = styled.div<{ width?: number }>`
  display: flex;
  width: ${({ width = 260 }) => `${width}px`};
  flex-direction: column;
  background-color: #f6f6f6;
`;

export default Container;
