import styled from 'styled-components';

const VariableBox = styled.div`
  position: relative;

  &::before {
    position: absolute;
    top: 14px;
    left: 16px;
    width: 40px;
    height: 43px;
    background-image: url(/logic.svg);
    background-repeat: no-repeat;
    content: '';
  }

  input {
    padding-left: 45px;
  }
`;
export default VariableBox;
