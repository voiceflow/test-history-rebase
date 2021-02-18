import styled from 'styled-components';

import FlexCenter from '@/components/Flex';

const ProjectTitleContainer = styled(FlexCenter)`
  font-size: 18px;
  height: inherit;
  display: flex;
  width: 100%;

  input {
    margin-top: -2px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export default ProjectTitleContainer;
