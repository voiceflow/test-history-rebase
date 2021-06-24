import { SvgIconContainer } from '@voiceflow/ui';

import TextEditor from '@/components/TextEditor';
import { styled } from '@/hocs';

const Editor = styled(TextEditor)`
  align-items: flex-start;

  & > ${SvgIconContainer} {
    margin-top: 3px;
  }

  .public-DraftEditor-content {
    max-height: 430px;
    overflow-x: hidden;
  }
`;

export default Editor;
