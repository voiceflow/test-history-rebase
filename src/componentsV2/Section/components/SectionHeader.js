import { FlexApart } from '@/componentsV2/Flex';
import { css, styled } from '@/hocs';

const SectionHeader = styled(FlexApart)`
  height: auto;
  padding: 22px 32px;
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
