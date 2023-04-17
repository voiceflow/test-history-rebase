import { css, styled, transition } from '@/hocs/styled';

const activeStyles = css`
  color: ${({ theme }) => theme.colors.darkBlue};
  cursor: pointer;
`;

const AddConditionButton = styled.span<{ additional?: boolean; isOpen: boolean }>`
  ${transition('color')};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};

  :hover {
    ${activeStyles}
  }

  ${({ isOpen }) => isOpen && activeStyles}

  ${({ additional }) =>
    additional &&
    css`
      padding-top: 8px;
    `}
`;

export default AddConditionButton;
