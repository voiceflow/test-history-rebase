import styled from 'styled-components';

const MultiSelectDropdown = styled.div`
  font-size: 15px;
  color: #8da2b5;
  flex: 1;
  line-height: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 10px;

  & > span {
    color: #132042;
  }
`;

export default MultiSelectDropdown;
