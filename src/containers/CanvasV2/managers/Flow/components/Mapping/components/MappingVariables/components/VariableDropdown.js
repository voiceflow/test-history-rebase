import PrefixedVariableSelect from '@/containers/CanvasV2/components/PrefixedVariableSelect';
import { styled } from '@/hocs';

import { spacingStyle } from '../styles';

const VariableDropdown = styled(PrefixedVariableSelect)`
  ${spacingStyle}
`;

export default VariableDropdown;
