import styled from 'styled-components';

const VariableTag = styled.span`
  display: inline-block;
  padding: 2px 5px;
  color: #132144;
  font-weight: 600;
  font-size: 13px;
  background-color: #eef4f6;
  border-radius: 10px;
  border: 1px solid #dfe3ed;
  cursor: default;
  line-height: 20px;
  text-align: center;

  &.default {
    color: #62778c;
  }
`;

export default VariableTag;
