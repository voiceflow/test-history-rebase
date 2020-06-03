import { MemberIcon } from '@/components/User';
import { BlockVariant } from '@/constants/canvas';
import { css, styled, transition, withBlockVariantStyle } from '@/hocs';
import {
  CANVAS_ACTIVATION_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_MARKUP_ENABLED,
  NODE_ACTIVE_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
  NODE_SELECTED_CLASSNAME,
} from '@/pages/Canvas/constants';
import { ClassName } from '@/styles/constants';

import { BLOCK_CONTAINER_PADDING } from '../constants';

const disabledStyles = css`
  opacity: 0.7;
`;

type BlockContainerProps = {
  variant: BlockVariant;
  blockColor?: string;
};

const BlockContainer = styled.div<BlockContainerProps>`
  width: ${({ theme }) => theme.components.block.width}px;
  border-radius: 8px;
  cursor: pointer;
  border: solid 2px #fff;
  padding: 0 ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px;
  background-color: #fff;
  background-image: ${withBlockVariantStyle((variant) => variant.backgroundImage)};
  position: relative;
  opacity: 1;
  border-color: none;

  ::before {
    display: block;
    border-radius: 8px;

    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;

    border: 1px solid ${withBlockVariantStyle((variant) => variant.borderColor)};

    content: '';

    ${transition('box-shadow')}
  }

  ${transition('opacity')}

  .${ClassName.CANVAS_NODE}:not(.${NODE_DISABLED_CLASSNAME}) &:hover::before {
    box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.2);
    border-color: ${withBlockVariantStyle((variant) => variant.activeBorderColor)};
  }

  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_HOVERED_CLASSNAME} & {
    cursor: copy;
  }

  .${NODE_FOCUSED_CLASSNAME} &::before {
    box-shadow: 0 12px 32px 0 rgba(17, 49, 96, 0.2);
    border-color: ${withBlockVariantStyle((variant) => variant.activeBorderColor)};
  }

  .${NODE_SELECTED_CLASSNAME} &,
  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_HOVERED_CLASSNAME}:not(.${NODE_DISABLED_CLASSNAME}) & {
    border-color: #5d9df5;

    ::before {
      display: none;
    }
  }

  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_DISABLED_CLASSNAME} & {
    ${disabledStyles}

    cursor: not-allowed;
  }

  .${CANVAS_ACTIVATION_CLASSNAME} .${ClassName.CANVAS_NODE}:not(.${NODE_ACTIVE_CLASSNAME}) & {
    ${disabledStyles}

    :not(.${NODE_MERGE_TARGET_CLASSNAME}):hover {
      opacity: 1;
    }
  }

  .${CANVAS_MARKUP_ENABLED} & {
    pointer-events: none !important
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
`;

export default BlockContainer;
