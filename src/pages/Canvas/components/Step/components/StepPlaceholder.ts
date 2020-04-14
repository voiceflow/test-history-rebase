import { BlockVariant } from '@/constants/canvas';
import { styled } from '@/hocs';

export type StepPlaceholderProps = {
  height: number;
  variant: BlockVariant;
};

const StepPlaceholder = styled.div<StepPlaceholderProps>`
  height: ${({ height }) => height + 2}px;
  border-radius: 5px;
  background-color: ${({ theme, variant }) => theme.components.block.variants[variant].color};
  opacity: 0.18;
`;

export default StepPlaceholder;
