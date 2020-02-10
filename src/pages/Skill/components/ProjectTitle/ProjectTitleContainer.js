import styled from 'styled-components';

import FlexCenter from '@/components/Flex';

const ProjectTitleContainer = styled(FlexCenter)`
  font-size: 18px;
  display: flex;
  align-items: center;
  height: inherit;
  margin-right: auto;
  flex: 2;

  input {
    margin-top: -2px;
    width: 100%;
  }
`;

export default ProjectTitleContainer;
