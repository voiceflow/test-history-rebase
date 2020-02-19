import { css, styled, units } from '@/hocs';

import { dividersStyles, draggingPreviewStyles, draggingStyles } from './SectionContainer';

const SimpleSection = styled.div`
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
