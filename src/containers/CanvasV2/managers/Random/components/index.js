import Checkbox from '@/components/Checkbox';
import { styled } from '@/hocs';

import InfoTooltip from './InfoTooltip';
import Button from './RandomEditorButton';

const RandomEditorCheckbox = styled(Checkbox)`
  float: left;
`;

export { InfoTooltip, Button, RandomEditorCheckbox as Checkbox };
