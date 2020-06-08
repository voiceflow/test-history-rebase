import { styled } from '@/hocs';
import { FormGroup as BaseFormGroup } from '@/pages/Canvas/components/MarkupComponents';
import { LeftColumn } from '@/pages/Canvas/components/MarkupComponents/FormGroup/components';

export const FormGroup = styled(BaseFormGroup)`
  ${LeftColumn} {
    min-width: 170px;
  }
`;

export default FormGroup;
