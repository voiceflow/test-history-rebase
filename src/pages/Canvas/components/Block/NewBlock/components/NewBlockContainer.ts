import { MemberIcon } from '@/components/User';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { css, styled, transition } from '@/hocs';
import { ACTIVE_NODES_CANVAS_CLASSNAME } from '@/pages/Canvas/constants';
import { Theme } from '@/styles/theme';

const ACTIVE_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const disabledStyles = {
  opacity: 0.7,
};

type NewBlockContainerProps = {
  state: BlockState;
  variant: BlockVariant;
  blockColor?: string;
};

const stateStyles = ({ state, variant, theme }: NewBlockContainerProps & { theme: Theme }) => {
  const blockVariant = theme.components.block.variants[variant];

  switch (state) {
    case BlockState.ACTIVE:
      return {
        boxShadow: `0 0 0 1.3px ${blockVariant.shadowColor}, 0 12px 32px 0 rgba(17, 49, 96, 0.2)`,
      };
    case BlockState.SELECTED:
      return {
        borderColor: '#5d9df5',
        boxShadow: 'none',
      };
    case BlockState.HOVERED:
      return css`
        border-color: #5d9df5;
        box-shadow: none;
        cursor: copy;
      `;
    case BlockState.DISABLED:
      return disabledStyles;
    case BlockState.REGULAR:
    default:
      return css`
        :hover {
          box-shadow: 0 0 0 1.3px ${blockVariant.shadowColor}, 0 4px 8px 0 rgba(17, 49, 96, 0.2);
        }
      `;
  }
};

const NewBlockContainer = styled.div<NewBlockContainerProps>`
  width: ${({ theme }) => theme.components.block.width}px;
  border-radius: 8px;
  cursor: pointer;
  border: solid 2px #fff;
  padding: 0 12px 12px 12px;
  background-color: #fff;
  background-image: ${({ variant, theme }) => theme.components.block.variants[variant].backgroundImage};
  box-shadow: 0 0 0 1.3px ${({ variant, theme }) => theme.components.block.variants[variant].shadowColor};
  position: relative;
  opacity: 1;
  ${transition('box-shadow', 'opacity')}

  ${stateStyles}

  .${ACTIVE_NODES_CANVAS_CLASSNAME} & {
    ${({ state }) => !ACTIVE_STATES.includes(state) && disabledStyles}
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }

  
`;

export default NewBlockContainer;
