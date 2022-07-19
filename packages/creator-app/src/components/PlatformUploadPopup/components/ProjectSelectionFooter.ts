import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import ProjectSelectionFooterLink from './ProjectSelectionFooterLink';

const ProjectSelectionFooter = styled(Box)`
  height: 68px;
  border-top: 1px solid #eaeff4;
  background-color: #fdfdfd;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;

  :hover {
    ${ProjectSelectionFooterLink} {
      color: #4986da;
    }
  }
`;

export default ProjectSelectionFooter;
