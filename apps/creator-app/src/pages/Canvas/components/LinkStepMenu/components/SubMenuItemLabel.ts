import { Text } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const Label = styled(Text)<{ disabled?: boolean; isLibrary?: boolean }>`
  display: block;
  padding-left: ${({ isLibrary }) => (isLibrary ? 0 : 12)}px;
  width: 100%;
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  ${({ disabled }) =>
    disabled &&
    css`
      color: #62778c;
    `}
`;

export default Label;
