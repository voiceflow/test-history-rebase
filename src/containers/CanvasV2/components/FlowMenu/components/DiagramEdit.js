import styled from 'styled-components';

const DiagramEdit = styled.div`
  display: flex;
  width: 54px;
  height: 42px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  padding-top: 1px;
  color: #8da2b590;
  font-size: 12px;
  text-align: center;
  background: none;
  border: none;
  opacity: 0;
  transition: 0.15s ease;

  &:hover {
    color: #62778c;
  }
`;

export default DiagramEdit;
