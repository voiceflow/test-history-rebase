import { css } from 'styled-components';

export const inputControlStyles = css`
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  display: block;
  width: 100%;
  margin-bottom: 0;
  color: #132042;
  font-size: 15px;
  letter-spacing: 0.1px;
  background: #fff;
  border: 1px solid #d2dae2;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  &:focus {
    border-color: #5d9df5;
    box-shadow: rgba(50, 50, 93, 0.03) 0 2px 3px, rgba(0, 0, 0, 0.03) 0 1px 3px;
    outline: 0;
  }
`;
