import { styled } from '@/hocs/styled';

const ProjectItem = styled.div`
  font-size: 15px;
  margin: 0px;
  padding: 11px 24px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #eef4f6;
  }
`;

export default ProjectItem;
