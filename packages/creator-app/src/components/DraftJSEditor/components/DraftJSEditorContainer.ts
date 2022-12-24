import { styled } from '@/hocs/styled';

export interface DraftJSEditorContainerProps {
  wordBreak?: string;
}

const DraftJSEditorContainer = styled.div<DraftJSEditorContainerProps>`
  word-break: ${({ wordBreak = 'normal' }) => wordBreak};

  & .public-DraftEditorPlaceholder-hasFocus,
  .public-DraftEditorPlaceholder-root {
    color: #8da2b5;
  }
`;

export default DraftJSEditorContainer;
