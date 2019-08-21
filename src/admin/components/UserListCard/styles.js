import styled from 'styled-components';

export const UserListCardWrapper = styled.div`
  background-color: ${(props) => props.theme.palette.background.highlight};
  border: 1px solid #eaeff4;
  padding: 16px;
  border-radius: 5px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 0.5rem;

  & > * + * {
    margin-left: 16px;
  }

  .beta-user-icon {
    height: 32px;
    width: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .user-info {
    overflow: hidden;
    white-space: nowrap;
    flex: 2;
  }
  .name {
    font-size: 1.1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .email {
    color: ${(props) => props.theme.palette.grey.light};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .delete-icon {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.palette.error.main};
    }
  }
`;
