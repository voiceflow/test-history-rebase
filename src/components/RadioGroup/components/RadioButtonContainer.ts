import { styled } from '@/hocs';

const RadioButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  :not(:last-child) {
    margin-right: 20px;
  }
`;

export default RadioButtonContainer;
