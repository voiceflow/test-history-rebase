import { BlockVariant } from '@/constants/canvas';
import { css, styled, transition, units } from '@/hocs';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

export type StepReorderIndicatorContainerProps = {
  isActive: boolean;
  variant: BlockVariant;
  isHovered?: boolean;
};

const StepReorderIndicatorContainer = styled.span<StepReorderIndicatorContainerProps>`
  position: relative;
  display: block;
  height: 0;
  width: 100%;
  border-radius: 5px;
  background-color: ${({ theme, variant }) => theme.components.block.variants[variant].color};
  ${transition('height', 'margin')}
  opacity: 0.18;

  &&& {
    margin: 0;
  }

  ${({ isActive, isHovered }) =>
    isActive &&
    css`
      .${MERGE_ACTIVE_NODE_CLASSNAME} &&& {
        height: 5px;

        :last-of-type {
          margin-top: ${units()}px;
        }

        :not(:first-child),
        :not(:last-child) {
          margin: ${units()}px 0;
        }

        :hover {
          height: ${({ theme }) => theme.components.blockStep.minHeight}px;
        }

        ${isHovered &&
          css`
             {
              height: ${({ theme }) => theme.components.blockStep.minHeight}px;
            }
          `}
      }
    `}
`;

export default StepReorderIndicatorContainer;
