import styled from 'styled-components';

import FlexCenter from '@/components/Flex';

const ProjectTitleContainer = styled(FlexCenter)`
  font-size: 18px;
  display: flex;
  align-items: center;
  height: inherit;
  margin-right: 50px;
  flex: 3;

  input {
    margin-top: -2px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export default ProjectTitleContainer;
