import { styled } from '@/hocs';

import { FOOTER_HEIGHT, HEADER_HEIGHT, dividerStyles } from '../styles';

const EditorContent = styled.div`
  ${dividerStyles}

  max-height: calc(100% - ${HEADER_HEIGHT + FOOTER_HEIGHT}px);
  overflow-y: scroll;
`;

export default EditorContent;
