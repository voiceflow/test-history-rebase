import Box from '@/components/Box';
import { css, styled } from '@/hocs';

const AddConditionButton = styled(Box)<{ additional?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};

  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
    cursor: pointer;
  }

  ${({ additional }) =>
    additional &&
    css`
      padding-top: 8px;
    `}
`;

export default AddConditionButton;
