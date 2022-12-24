import EditableText from '@/components/EditableText';
import { styled } from '@/hocs/styled';

export const Title = styled(EditableText)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  width: 100%;
  text-align: left;
  margin-top: 11px;
`;
