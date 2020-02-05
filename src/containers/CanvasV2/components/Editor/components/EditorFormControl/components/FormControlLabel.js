import { flexStyles } from '@/componentsV2/Flex';
import { IconContainer } from '@/componentsV2/InfoIcon';
import { styled, units } from '@/hocs';

const FormControlLabel = styled.label`
  ${flexStyles}

  margin-bottom: 12px;

  ${IconContainer} {
    margin-left: ${units(2)}px;
  }
`;

export default FormControlLabel;
