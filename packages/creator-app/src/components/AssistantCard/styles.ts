import { Link } from '@voiceflow/ui';

import EditableText from '@/components/EditableText';
import { css, styled } from '@/hocs/styled';

export const Title = styled(EditableText)`
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProjectImage = styled.div<{ src: string }>`
  width: 80px;
  height: 80px;
  position: absolute;
  background: ${({ src }) => css`url(${src})`} no-repeat center center;
  background-size: cover;

  border-radius: 12px;
  box-shadow: 0px 12px 24px rgba(19, 33, 68, 0.04), 0px 8px 12px rgba(19, 33, 68, 0.04), 0px 4px 4px rgba(19, 33, 68, 0.02),
    0px 2px 2px rgba(19, 33, 68, 0.01), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 1px 0px rgba(17, 49, 96, 0.03), 0px 0px 0px rgba(17, 49, 96, 0.06);
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
