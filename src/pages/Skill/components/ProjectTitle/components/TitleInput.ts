import EditableText from '@/components/EditableText';
import { styled } from '@/hocs';

const TitleInput = styled(EditableText)`
  position: relative;
  margin-right: 14px;
  margin-bottom: 2px;
  box-sizing: content-box;

  span& {
    padding-right: 2px;
  }
`;

export default TitleInput;
