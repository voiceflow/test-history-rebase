import styled from 'styled-components';

export const ProjectNameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const ProjectTitleDetails = styled.div`
  display: flex;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  flex-direction: column;
  align-content: flex-end;
  max-width: 170px;
  margin-top: -1px;
  margin-bottom: -1px;
`;

export const ProjectTitle = styled.div`
  margin-bottom: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ProjectTitleCaption = styled(ProjectTitle)`
  color: #8da2b5;
  font-weight: 300;
  font-size: 13px;
  line-height: 1.5384615385;
`;

export const ProjectListDragZone = styled.div`
  height: 76px;
  background-color: #fff;
  background-image: url(/empty-state.svg);
  background-repeat: no-repeat;
  background-size: 10%;
  background-size: cover;
  border: 1px solid #eaeff4;
  border-radius: 7px;
`;
