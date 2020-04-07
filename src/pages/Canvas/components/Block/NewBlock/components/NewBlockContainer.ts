import { MemberIcon } from '@/components/User';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { css, styled, transition } from '@/hocs';
import { ACTIVE_NODES_CANVAS_CLASSNAME, MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';
import { Theme } from '@/styles/theme';

import { BLOCK_CONTAINER_PADDING } from '../constants';

const ACTIVE_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const disabledStyles = {
  opacity: 0.7,
};

type NewBlockContainerProps = {
  state: BlockState;
  variant: BlockVariant;
  blockColor?: string;
  hasLinkWarning?: boolean;
};

const stateStyles = ({ state, variant, theme }: NewBlockContainerProps & { theme: Theme }) => {
  const blockVariant = theme.components.block.variants[variant];

  switch (state) {
    case BlockState.ACTIVE:
      return css`
        &::before {
          box-shadow: 0 12px 32px 0 rgba(17, 49, 96, 0.2);
          border-color: ${blockVariant.activeBorderColor};
        }
      `;
    case BlockState.SELECTED:
      return css`
        border-color: #5d9df5;

        &::before {
          display: none;
        }
      `;
    case BlockState.HOVERED:
      return css`
        border-color: #5d9df5;
        cursor: copy;

        &::before {
          display: none;
        }
      `;
    case BlockState.DISABLED:
      return disabledStyles;
    case BlockState.REGULAR:
    default:
      return css`
        :hover {
          &::before {
            box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.2);
            border-color: ${blockVariant.activeBorderColor};
          }
        }
      `;
  }
};

const NewBlockContainer = styled.div<NewBlockContainerProps>`
  width: ${({ theme }) => theme.components.block.width}px;
  border-radius: 8px;
  cursor: pointer;
  border: solid 2px #fff;
  padding: 0 ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px;
  background-color: #fff;
  background-image: ${({ variant, theme }) => theme.components.block.variants[variant].backgroundImage};
  position: relative;
  opacity: 1;
  border-color: none;

  &:before {
    display: block;
    border-radius: 8px;

    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;

    border: 1px solid ${({ variant, theme }) => theme.components.block.variants[variant].borderColor};

    content: '';

    ${transition('box-shadow')}
  }

  ${transition('opacity')}

  ${stateStyles}

  .${ACTIVE_NODES_CANVAS_CLASSNAME} & {
    ${({ state }) =>
      !ACTIVE_STATES.includes(state) &&
      css`
        ${disabledStyles}

        &:not(.${MERGE_ACTIVE_NODE_CLASSNAME}):hover {
          opacity: 1;
        }
      `}
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }

  ${({ hasLinkWarning }) =>
    hasLinkWarning &&
    css`
      cursor: not-allowed;
    `}
`;

export default NewBlockContainer;
