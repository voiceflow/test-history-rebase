import { flexStyles } from '@/components/Flex';
import { IconContainer } from '@/components/InfoIcon';
import { styled, units } from '@/hocs';

const FormControlLabel = styled.label`
  ${flexStyles}

  margin-bottom: 11px;

  ${IconContainer} {
    margin-left: ${units(2)}px;
  }
`;

export default FormControlLabel;
