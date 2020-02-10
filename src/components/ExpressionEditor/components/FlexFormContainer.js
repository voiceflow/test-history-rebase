import { flexStyles } from '@/components/Flex';
import { SearchInputIcon } from '@/components/Select/components';
import { styled, units } from '@/hocs';

import ExpressionMenuToggle from './ExpressionMenuToggle';
import FormContainer from './FormContainer';

const FlexFormContainer = styled(FormContainer)`
  ${flexStyles}

  ${ExpressionMenuToggle} {
    position: absolute;
    right: ${units()}px;
  }

  ${SearchInputIcon} {
    right: ${units(4)}px;
  }
`;

export default FlexFormContainer;
