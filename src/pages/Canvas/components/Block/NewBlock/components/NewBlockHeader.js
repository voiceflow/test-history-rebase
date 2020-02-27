import { flexCenterStyles } from '@/components/Flex';
import { BlockState } from '@/constants/canvas';
import { css, styled } from '@/hocs';

const ACTIVATED_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const NewBlockHeader = styled.header`
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
