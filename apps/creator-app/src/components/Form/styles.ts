import { css } from 'styled-components';

export const inputControlStyles = css`
  min-height: ${({ theme }) => theme.components.input.height}px;
  padding: 8px 16px;
  display: block;
  width: 100%;
  margin-bottom: 0;
  color: #132042;
  font-size: 15px;
  background: #fff;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);

  &:focus {
    border-color: #5d9df5;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
    outline: 0;
  }
`;
