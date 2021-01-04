import { styled } from '@/hocs';

type PrototypeVisualPlaceholderProps = {
  width: number;
  height: number;
};

const PrototypeVisualPlaceholder = styled.div<PrototypeVisualPlaceholderProps>`
  background: #fff;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

export default PrototypeVisualPlaceholder;
