import BaseFormGroup, { LeftColumn } from '@/components/FormGroup';
import { styled } from '@/hocs/styled';

export const FormGroup = styled(BaseFormGroup)`
  ${LeftColumn} {
    min-width: 170px;
  }
`;

export default FormGroup;
