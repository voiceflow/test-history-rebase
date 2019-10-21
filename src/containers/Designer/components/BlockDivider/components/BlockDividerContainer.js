import LabeledHorizontalDivider from '@/components/Divider/components/LabeledHorizontalDivider';
import Flex from '@/componentsV2/Flex';
import { css, styled, transition, units } from '@/hocs';

const activeBlockDividerStyles = css`
  height: ${units(2)}px;

  & ${LabeledHorizontalDivider} {
    opacity: 1;
  }
`;

const BlockDividerContainer = styled(Flex)`
  ${transition('height')}

  position: relative;
  height: 0;
  cursor: pointer;

  &:focus-within {
    ${activeBlockDividerStyles}
  }

  & ${LabeledHorizontalDivider} {
    ${transition('opacity')}
    opacity: 0;

    &::after,
    &::before {
      border-color: #8da2b550 !important;
    }
  }

  ${({ isActive }) =>
    isActive &&
    css`
      &:hover {
        ${activeBlockDividerStyles}
      }
    `}
`;

export default BlockDividerContainer;
