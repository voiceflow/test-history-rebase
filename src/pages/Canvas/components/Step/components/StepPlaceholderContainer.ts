import { BlockVariant } from '@/constants/canvas';
import { styled, transition } from '@/hocs';

export type StepPlaceholderProps = {
  variant: BlockVariant;
  forceHeight: boolean;
};

const StepPlaceholderContainer = styled.div<StepPlaceholderProps>`
  position: relative;
  height: ${({ theme, forceHeight }) => (forceHeight ? theme.components.blockStep.minHeight + 2 : 5)}px;
  border-radius: 5px;
  background-color: ${({ theme, variant }) => theme.components.block.variants[variant].color};
  opacity: 0.18;
  ${transition('height')}

  &:hover {
    height: ${({ theme }) => theme.components.blockStep.minHeight + 2}px;
  }
`;

export default StepPlaceholderContainer;
