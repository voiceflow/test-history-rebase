import { styled } from '@ui/styles';

const Multiline = styled.div<{ width?: number }>`
  width: ${({ width = 176 }) => width}px;
  text-align: start;
`;

export default Multiline;
