import { styled } from '@/hocs/styled';
import StepContainer from '@/pages/Canvas/components/Step/components/StepContainer';

export interface MergePreviewProps {
  isVisible: boolean;
  isTransparent: boolean;
}

const MergePreview = styled.div<MergePreviewProps>`
  position: absolute;
  width: 304px;
  box-shadow:
    0 4px 8px 0 rgba(17, 49, 96, 0.16),
    0 0 1px 1px rgba(17, 49, 96, 0.08);
  border-radius: 5px;
  z-index: 20;

  ${({ isVisible, isTransparent }) => ({
    visibility: isVisible ? 'visible' : 'hidden',
    opacity: isTransparent ? 0.9 : 1,
  })}

  ${StepContainer} {
    box-shadow: none;
    border: 0;
  }
`;

export default MergePreview;
