import styled from 'styled-components';

const PublishSidebarItem = styled.div`
  margin: 8px 0;
  padding: 5px 25px;
  color: #8da2b5;
  text-transform: capitalize;
  text-decoration: none;
  border-right: 2px solid transparent;
  transition: all 0.2s ease-out;

  &:hover {
    color: #62778c;
  }

  &.active {
    color: #5d9df5;
    border-color: #5d9df5;
  }
`;

export default PublishSidebarItem;
