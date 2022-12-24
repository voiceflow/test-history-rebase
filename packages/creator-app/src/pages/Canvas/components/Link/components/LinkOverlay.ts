import { styled } from '@/hocs/styled';

const LinkOverlay = styled.path<{ isEditingMode?: boolean }>`
  fill: none;
  stroke: white;
  stroke-width: 12px;
  pointer-events: ${({ isEditingMode }) => (isEditingMode ? 'stroke' : 'none')};
  visibility: hidden;
  cursor: pointer;

  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

export default LinkOverlay;
