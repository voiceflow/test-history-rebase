import { styled } from '@/hocs';

import BlockEditorSection from './BlockEditorSection';

const BlockEditorContent = styled.div`
  padding-bottom: ${({ theme }) => theme.unit * 2}px;

  & > ${BlockEditorSection}:last-of-type {
    border-bottom: 0;
  }
`;

export default BlockEditorContent;
