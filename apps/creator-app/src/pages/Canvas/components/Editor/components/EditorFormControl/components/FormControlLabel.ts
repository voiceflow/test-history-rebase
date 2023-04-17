import { flexStyles, TutorialInfoIcon } from '@voiceflow/ui';

import { styled, units } from '@/hocs/styled';

const FormControlLabel = styled.label`
  ${flexStyles}

  margin-bottom: 11px;

  ${TutorialInfoIcon.IconContainer} {
    margin-left: ${units(1)}px;
  }
`;

export default FormControlLabel;
