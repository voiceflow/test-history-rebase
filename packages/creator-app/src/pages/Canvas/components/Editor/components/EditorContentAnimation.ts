import { styled } from '@/hocs';
import { FadeContainer } from '@/styles/animations';

const EditorContainer = styled(FadeContainer)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  flex: 1;
`;

export default EditorContainer;
