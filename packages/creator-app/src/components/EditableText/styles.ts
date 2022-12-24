import { css } from '@/hocs/styled';

export const defaultTextStyles = css`
  background: none;
  color: inherit;
  border: 0;
  border-radius: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  font-size: inherit;
  font-weight: inherit;

  :focus,
  :active,
  :hover,
  :disabled {
    background: initial;
    border: initial;
    outline: initial;
  }
`;
