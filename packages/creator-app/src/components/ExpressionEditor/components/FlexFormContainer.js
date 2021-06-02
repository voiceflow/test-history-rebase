import { flexStyles } from '@/components/Flex';
import { SearchInputIcon } from '@/components/Select/components';
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
