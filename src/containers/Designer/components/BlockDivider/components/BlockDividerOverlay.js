import { FlexCenter } from '@/componentsV2/Flex';
import { css, styled, units } from '@/hocs';

const BlockDividerOverlay = styled(FlexCenter)`
  position: absolute;
  width: 100%;
  height: 0;
  z-index: 5;

  ${({ isActive }) =>
    isActive &&
    css`
      height: calc(100% + ${units(3)}px);
    `}
`;

export default BlockDividerOverlay;
