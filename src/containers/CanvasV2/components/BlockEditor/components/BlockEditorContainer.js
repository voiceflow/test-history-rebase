import { styled, units } from '@/hocs';

import BlockEditorHeader from './BlockEditorHeader';
import BlockEditorSection from './BlockEditorSection';

const BlockEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & ${BlockEditorSection}, & ${BlockEditorHeader} {
    border-bottom: 1px solid #eaeff4;
  }

  & ${BlockEditorSection} {
    padding: ${units(2.75)}px;
  }

  & ${BlockEditorHeader} {
    padding: ${units()}px ${units(2.75)}px ${units()}px ${units(2.75)}px;
  }

  & > ${BlockEditorSection}:last-of-type {
    border-bottom: 0;
  }
`;

export default BlockEditorContainer;
