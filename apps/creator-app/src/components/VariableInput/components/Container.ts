import { inputDisabledStyle } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  isFocused: boolean;
  disabled: boolean;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid;
  border-color: ${({ isFocused }) => (isFocused ? '#5d9df5' : '#d4d9e6')};
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  width: 100%;
  display: flex;
  flex-direction: column;
  transition:
    background-color 0.12s linear,
    color 0.12s linear,
    border-color 0.12s linear,
    box-shadow 0.12s linear,
    max-height 0.12s linear;

  ${({ disabled }) =>
    disabled &&
    css`
      ${inputDisabledStyle}

      input {
        ${inputDisabledStyle}
      }
    `}
`;

export default Container;
