import { SvgIcon } from '@voiceflow/ui';

import TextEditor from '@/components/TextEditor';
import { styled } from '@/hocs/styled';

const Editor = styled(TextEditor)`
  align-items: flex-start;

  & > ${SvgIcon.Container} {
    margin-top: 3px;
  }

  .public-DraftEditor-content {
    max-height: 430px;
    overflow-x: hidden;
  }
`;

export default Editor;
