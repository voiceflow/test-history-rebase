import { css, styled } from '@/hocs';

export const inputFocus = css`
  border: 1px solid #5d9df5;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  outline: 0;
`;

export const inputMinHeight = css`
  min-height: 42px;
`;

export const inputDisabled = css`
  color: #949db0;
  pointer-events: none;
`;

export const inputStyle = css`
  ${inputMinHeight};
  display: block;
  width: 100%;
  color: #132042;
  font: normal 15px Open Sans, Arial, sans-serif;
  font-size: 15px;
  background: #fff;
  border: 1px solid #d2dae2;
  border-radius: 6px;
  padding: 11px 16px 9px;
  line-height: 22px;
  cursor: text;
  transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, padding 0.12s linear,
    max-height 0.12s linear;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);

  &:disabled {
    ${inputDisabled}
  }

  &:active,
  &:focus,
  &:focus-within {
    ${inputFocus}
  }

  ${({ error, borderColor }) =>
    (error || borderColor) &&
    css`
      border: 1px solid ${error ? '#E91E63' : borderColor} !important;
    `}
`;

export const ChildInput = styled.div`
  flex: 1;
  min-width: 50%;
`;

export const InputWrapper = styled.div`
  ${inputStyle}

  display: flex;
  align-items: center;

  &[disabled] {
    ${inputDisabled}
    input {
      ${inputDisabled}
    }
  }

  & > * {
    margin-right: 12px;
    :last-child {
      margin-right: 0;
    }
  }
`;
