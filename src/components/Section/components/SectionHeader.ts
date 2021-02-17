import { FlexApart } from '@/components/Flex';
import { css, styled, transition, units } from '@/hocs';

type SectionHeaderProps = {
  isDragging?: boolean;
  containerToggle?: boolean;
  nestedIntend?: boolean;
};

const SectionHeader = styled(FlexApart)<SectionHeaderProps>`
  height: auto;
  padding: ${units(2.5)}px ${units(4)}px;
  overflow: visible;
  cursor: default;

  ${transition('background')};

  ${({ nestedIntend }) =>
    nestedIntend &&
    css`
      padding-left: 0;
    `}

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
