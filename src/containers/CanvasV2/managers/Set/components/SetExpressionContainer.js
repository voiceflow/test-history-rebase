import styled from 'styled-components';

import Section from '@/containers/CanvasV2/components/BlockEditor/components/BlockEditorSection';

const SetExpressionContainer = styled(Section)`
  position: relative;

  & > button.close {
    position: absolute;
    top: 22px;
    right: 22px;
    width: 14px;
    margin: 0;
  }
`;

export default SetExpressionContainer;
