import { styled } from '@/hocs';

const DraftJSEditorContainer = styled.div`
  word-break: ${({ wordBreak = 'normal' }) => wordBreak};

  & .public-DraftEditorPlaceholder-hasFocus,
  .public-DraftEditorPlaceholder-root {
    color: #8da2b5;
  }
`;

export default DraftJSEditorContainer;
