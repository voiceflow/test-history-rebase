import { css, styled, units } from '@/hocs';

const RadioButtonLabel = styled.label`
  font-weight: 400 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  & > input {
    display: flex;
    width: auto;
    margin-right: ${units()}px;
  }

  & > span {
    flex: 1;

    ${({ disabled }) =>
      disabled &&
      css`
        color: #8da2b5;
      `}
  }
`;

export default RadioButtonLabel;
