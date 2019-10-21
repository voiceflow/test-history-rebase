import Section from '@/containers/CanvasV2/components/BlockEditor/components/BlockEditorSection';
import { css, styled } from '@/hocs';

const SpeakElementContainer = styled(Section)`
  cursor: pointer;

  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0;
    `}

  & > * {
    margin: 0;
  }

  &&& {
    padding-top: ${({ theme }) => theme.unit}px;
    padding-bottom: ${({ theme }) => theme.unit}px;
  }

  & .dropzone {
    margin-top: ${({ theme }) => theme.unit}px;
    margin-bottom: ${({ theme }) => theme.unit}px;
  }
`;

export default SpeakElementContainer;
