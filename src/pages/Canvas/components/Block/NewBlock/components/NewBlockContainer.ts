import { MemberIcon } from '@/components/User';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { css, styled, transition } from '@/hocs';
import { Theme } from '@/styles/theme';

type NewBlockContainerProps = {
  state: BlockState;
  variant: BlockVariant;
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
    case BlockState.DISABLED:
      return {
        opacity: 0.7,
      };
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
  ${transition('box-shadow')}

  ${stateStyles}

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
`;

export default NewBlockContainer;
