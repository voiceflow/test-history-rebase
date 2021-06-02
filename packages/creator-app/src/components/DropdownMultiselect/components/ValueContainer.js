import styled from 'styled-components';

const ValueContainer = styled.div`
  font-size: 15px;
  color: #132042;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 10px;

  & > span {
    color: #8da2b5;
  }
`;

export default ValueContainer;
