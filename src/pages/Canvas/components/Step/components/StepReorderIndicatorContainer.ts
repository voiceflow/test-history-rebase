import { BlockVariant } from '@/constants/canvas';
import { css, styled, transition, withBlockVariantStyle } from '@/hocs';
import { NODE_MERGE_TARGET_CLASSNAME } from '@/pages/Canvas/constants';

import CaptureZone from './StepReorderCaptureZone';

export type StepReorderIndicatorContainerProps = {
  isActive: boolean;
  variant: BlockVariant;
  isHovered?: boolean;
  isLast?: boolean;
};

const hoverStyle = css<StepReorderIndicatorContainerProps>`
  height: ${({ theme }) => theme.components.blockStep.minHeight + 2}px;
  margin: ${({ isLast }) => (isLast ? '6px 0 0 0' : '0 0 6px 0')};

  > ${CaptureZone} {
    top: -38px;
  }

  ::before {
    display: none;
  }

  :hover {
    height: ${({ theme }) => theme.components.blockStep.minHeight + 2}px;
  }
`;

const StepReorderIndicatorContainer = styled.span<StepReorderIndicatorContainerProps>`
  position: relative;
  display: none;
  width: 100%;
  height: 0;
  background-color: ${withBlockVariantStyle((variant) => variant.color)}22;
  border-radius: 5px;

  &&& {
    margin: 0;
  }

  ::before {
    position: absolute;
    top: ${({ isLast }) => (isLast ? '2' : '-4')}px;
    right: 1px;
    left: 1px;
    height: 2px;
    background-color: ${withBlockVariantStyle((variant) => variant.color)}AA;
    border-radius: 2px;
    content: '';
  }

  ${({ isActive, isHovered }) =>
    isActive &&
    css`
      .${NODE_MERGE_TARGET_CLASSNAME} &&&,
      &&&.${NODE_MERGE_TARGET_CLASSNAME} {
        display: block;

        :hover {
          ${hoverStyle}
        }

        ${isHovered && hoverStyle}
        ${transition('height', 'margin')}
      }
    `}
`;

export default StepReorderIndicatorContainer;
