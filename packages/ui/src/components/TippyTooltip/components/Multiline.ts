import { styled } from '@ui/styles';

const Multiline = styled.div<{ width?: number }>`
  padding: 4px 0;
  width: ${({ width = 176 }) => width}px;
  text-align: start;
  color: #f2f7f7;
`;

export default Multiline;
