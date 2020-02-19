import { FlexApart } from '@/components/Flex';
import { css, styled, units } from '@/hocs';

const SectionHeader = styled(FlexApart)`
  height: auto;
  padding: ${units(2.5)}px ${units(4)}px;
  overflow: visible;
  cursor: default;

  ${({ containerToggle }) =>
    containerToggle &&
    css`
      cursor: pointer;
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      cursor: grabbing;
    `}
`;

export default SectionHeader;
