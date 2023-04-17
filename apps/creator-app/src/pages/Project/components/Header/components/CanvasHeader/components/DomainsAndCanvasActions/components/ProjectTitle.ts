import EditableText from '@/components/EditableText';
import { styled } from '@/hocs/styled';

const ProjectTitle = styled(EditableText)<{ $secondary?: boolean }>`
  max-width: 250px;
  overflow: hidden;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ $secondary, theme }) => ($secondary ? theme.colors.secondary : theme.colors.primary)};
`;

export default ProjectTitle;
