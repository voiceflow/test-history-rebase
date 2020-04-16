import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

const BookDemoContainer = styled.div<{ disabled?: boolean }>`
  ${flexCenterStyles}

  font-size: 15px;
  color: #62778c;
  padding-top: 30px;
  padding-bottom: 40px;

  label,
  input {
    font-weight: normal !important;
    ${({ disabled }) =>
      disabled &&
      css`
        cursor: no-drop;
        font-color: #8da2b5;
      `};
  }
`;

export default BookDemoContainer;
