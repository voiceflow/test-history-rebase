import { css, styled } from '@/hocs';

import { dividersStyles, draggingPreviewStyles, draggingStyles } from './SectionContainer';

const SimpleSection = styled.div`
  position: relative;
  background-color: #fff;
  padding: 22px 32px;

  ${({ isNested }) =>
    isNested &&
    css`
      margin-left: -32px;
      margin-right: -32px;
    `}

  ${({ dividers = true }) => dividers && dividersStyles}

  ${({ isDragging }) => isDragging && draggingStyles}

  ${({ isDraggingPreview }) => isDraggingPreview && draggingPreviewStyles}
`;

export default SimpleSection;
