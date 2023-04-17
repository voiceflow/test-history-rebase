import { Link } from '@voiceflow/ui';

import EditableText from '@/components/EditableText';
import { styled } from '@/hocs/styled';

export const Title = styled(EditableText)`
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledLink = styled(Link)`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

export const MembersContainer = styled.div`
  margin-left: 5px;
  display: inline-flex;
`;
