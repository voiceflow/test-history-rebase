import { styled } from '@/hocs';

export type MergePreviewProps = {
  isVisible: boolean;
};

const MergePreview = styled.div<MergePreviewProps>`
  position: absolute;
  width: 332px;
  opacity: 0.7;
  z-index: 20;

  ${({ isVisible }) => ({
    visibility: isVisible ? 'visible' : 'hidden',
  })}
`;

export default MergePreview;
