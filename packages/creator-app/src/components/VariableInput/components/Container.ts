import { inputDisabledStyle } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

interface ContainerProps {
  isFocused: boolean;
  disabled: boolean;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid;
  border-color: ${({ isFocused }) => (isFocused ? '#5d9df5' : '#d4d9e6')};
  padding: 12px 16px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;

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
