import styled from 'styled-components';

const ActionButton = styled.div`
  background: #fff;
  color: #5d9df5;
  display: block;
  font-size: 15px;
  padding: 18px 0px;
  width: 100%;
  user-select: none;
  border-top: 1px solid #dce5e8;
  text-align: center;
  bottom: 0;
  position: sticky;
  border-radius: 0px 0px 8px 8px;
  white-space: nowrap;
  overflow: hidden;
  transition: ease all 0.15s;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    text-decoration: underline;
    color: #4986da;
  }
`;

export default ActionButton;
