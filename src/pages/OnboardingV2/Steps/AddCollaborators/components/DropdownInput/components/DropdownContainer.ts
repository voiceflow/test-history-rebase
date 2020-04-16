import { InputGroup, InputGroupProps } from 'reactstrap';

import { TextInputContainer } from '@/components/ButtonDropdownInput/components';
import { css, styled } from '@/hocs';

import DropdownButton from './DropdownButton';
import Input from './Input';

const DropdownContainer = styled(InputGroup as any)<InputGroupProps & { isInvalid: boolean; isDisabled: boolean }>`
  position: relative;
  flex-wrap: nowrap;
  flex: 1;

  & ${Input}, ${DropdownButton}, ${TextInputContainer} {
    transition: border-color 0.15s ease;
    border-color: #d2dae2 !important;

    ${({ isInvalid }) =>
      isInvalid &&
      css`
        border-color: #e91e63 !important;
      `}

    ${({ isDisabled }) =>
      isDisabled &&
      css`
        cursor: no-drop;
        color: #62778c !important;

        :hover {
          color: #62778c !important;
        }
      `}
  }

  :focus-within {
    & ${Input}, ${DropdownButton} {
      border-color: #5d9df5 !important;

      ${({ isInvalid }) =>
        isInvalid &&
        css`
          border-color: #e91e63 !important;
        `}

      ${({ isDisabled }) =>
        isDisabled &&
        css`
          cursor: no-drop;
          border-color: #d2dae2 !important;
        `}
    }
  }
`;

export default DropdownContainer;
