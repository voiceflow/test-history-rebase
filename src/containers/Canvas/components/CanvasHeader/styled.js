import styled from 'styled-components';

export const ProjectTitleContainer = styled.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  display: flex;
  align-items: center;
  height: inherit;

  & > * {
    height: inherit;
  }
`;
