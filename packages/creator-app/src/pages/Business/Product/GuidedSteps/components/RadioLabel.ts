import { css, styled, units } from '@/hocs/styled';

export interface RadioButtonLabelProps {
  isDisabled?: boolean;
}

const RadioButtonLabel = styled.label<RadioButtonLabelProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400 !important;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};

  & > input {
    display: flex;
    width: auto;
    min-height: auto;
    margin-right: ${units()}px;
  }

  & > span {
    flex: 1;

    ${({ isDisabled }) =>
      isDisabled &&
      css`
        color: #8da2b5;
      `}
  }
`;

export default RadioButtonLabel;
