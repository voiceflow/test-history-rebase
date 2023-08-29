import { Animations } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const EditorContainer = styled(Animations.Fade)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  flex: 1;
`;

export default EditorContainer;
