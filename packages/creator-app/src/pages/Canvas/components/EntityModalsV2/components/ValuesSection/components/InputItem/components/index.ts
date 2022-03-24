import { Input } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const Container = styled.div<{ active: boolean }>`
  ${transition('border')};
  padding: 11px 16px;
  border: solid 1px #d4d9e6;
  border-radius: 6px;
  flex: 2;
  box-shadow: 0 0 3px 0 rgb(17 49 96 / 6%);
  ${({ active }) =>
    active &&
    css`
      border: 1px solid #5d9df5;
    `}
`;

export const ValueInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;
  padding: 0px;
  min-height: 0;
  margin-bottom: 4px;
  border-radius: 0;
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const SynonymsInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;
  border-radius: 0;
  padding: 0px;
  font-size: 14px;
  min-height: 0;
  text-overflow: ellipsis;
  color: #62778c;
  ::placeholder {
    font-size: 14px;
  }
`;
