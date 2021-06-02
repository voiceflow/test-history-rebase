import styled from 'styled-components';

import FlexCenter from '@/components/Flex';

import TitleInput from './TitleInput';

const ProjectTitleContainer = styled(FlexCenter)`
  font-size: 18px;
  height: inherit;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  ${TitleInput}, ${TitleInput} input {
    cursor: text;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  ${TitleInput} + * {
    margin-right: 14px;
  }
`;

export default ProjectTitleContainer;
