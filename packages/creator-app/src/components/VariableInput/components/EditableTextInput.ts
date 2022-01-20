import EditableText from '@/components/EditableText';
import { styled } from '@/hocs';

const EditableTextInput = styled(EditableText)`
  height: 22px;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default EditableTextInput;
