import { css, styled } from '@/hocs/styled';

export interface InputProps {
  isActive?: boolean;
  hasItems?: boolean;
}

const Input = styled.div<InputProps>`
  border-radius: 5px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px #d4d9e6;
  min-height: ${({ theme }) => theme.components.input.height}px;
  max-height: 117px;
  width: 100%;
  padding: ${({ hasItems }) => (hasItems ? '7px 8px' : '11px 16px')};
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;

  ${({ isActive }) =>
    isActive &&
    css`
      border-color: ${({ theme }) => theme.colors.blue};
    `}

  input {
    min-width: 20px;
    width: 100%;
  }
`;

export default Input;
