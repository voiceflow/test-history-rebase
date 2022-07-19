import { css, styled, units } from '@/hocs/styled';

import { dividersStyles, draggingPreviewStyles, draggingStyles } from './SectionContainer';

interface SimpleSectionProps {
  isNested?: boolean;
  dividers?: boolean;
  isDragging?: boolean;
  isDraggingPreview?: boolean;
}

const SimpleSection = styled.div<SimpleSectionProps>`
  position: relative;
  background-color: #fff;
  padding: ${units(2.5)}px ${units(4)}px;

  ${({ isNested }) =>
    isNested &&
    css`
      margin-left: -${units(4)}px;
      margin-right: -${units(4)}px;
    `}

  ${({ dividers = true }) => dividers && dividersStyles}

  ${({ isDragging }) => isDragging && draggingStyles}

  ${({ isDraggingPreview }) => isDraggingPreview && draggingPreviewStyles}
`;

export default SimpleSection;
