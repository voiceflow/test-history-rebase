import EditableText from '@/components/EditableText';
import { styled } from '@/hocs';

const ProjectTitle = styled(EditableText)`
  overflow: hidden;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default ProjectTitle;
