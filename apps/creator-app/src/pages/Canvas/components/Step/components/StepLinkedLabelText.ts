import { css, styled } from '@/hocs/styled';

import { LINKED_LINE_HEIGHT } from '../constants';
import LabelText from './StepLabelText';

const LinkedLabelText = styled(LabelText)`
  ${({ lineClamp = 3, multiline }) =>
    multiline &&
    css`
      max-height: ${LINKED_LINE_HEIGHT * lineClamp}px;
    `};
`;

export default LinkedLabelText;
