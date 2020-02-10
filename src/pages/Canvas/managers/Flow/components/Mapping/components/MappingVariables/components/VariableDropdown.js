import { styled } from '@/hocs';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';

import { spacingStyle } from '../styles';

const VariableDropdown = styled(PrefixedVariableSelect)`
  ${spacingStyle}
`;

export default VariableDropdown;
