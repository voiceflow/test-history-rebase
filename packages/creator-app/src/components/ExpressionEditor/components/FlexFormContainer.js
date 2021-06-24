import { flexStyles, SearchInputIcon } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

import ExpressionMenuToggle from './ExpressionMenuToggle';
import FormContainer from './FormContainer';

const FlexFormContainer = styled(FormContainer)`
  ${flexStyles}

  ${ExpressionMenuToggle} {
    position: absolute;
    top: 13px;
    right: 16px;
  }

  ${SearchInputIcon} {
    right: ${units(4)}px;
  }
`;

export default FlexFormContainer;
