import { flexCenterStyles } from '@/components/Flex';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { css, styled } from '@/hocs';

type NewBlockHeaderProps = {
  state: BlockState;
  hasIcon?: boolean;
  variant: BlockVariant;
};

const ACTIVATED_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const NewBlockHeader = styled.header<NewBlockHeaderProps>`
  ${flexCenterStyles}
  height: 54px;
  font-size: 15px;
  font-weight: 600;

  ${({ hasIcon }) =>
    hasIcon &&
    css`
      padding: 0 42px;
    `}

  color: ${({ variant, state, theme }) => {
    const isActivated = ACTIVATED_STATES.includes(state);
    const variantStyles = theme.components.block.variants[variant];

    return variantStyles[isActivated ? 'activeColor' : 'color'];
  }};
`;

export default NewBlockHeader;
