import { Input } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const Container = styled.div<{ isActive: boolean }>`
  ${transition('border')};

  flex: 2;
  border: 1px solid #d2dae2;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  cursor: text;
  transition: border-color 0.12s linear, box-shadow 0.12s linear, max-height 0.12s linear;

  &:focus-within {
    ${Input.focusStyle}
  }

  ${({ isActive }) => isActive && Input.focusStyle}
`;

export const ValueInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;
  padding: 11px 16px 4px 16px;
  min-height: 0;
  border-radius: 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const SynonymsInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;
  border-radius: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 0 16px 11px 16px;
  font-size: 14px;
  min-height: 0;
  text-overflow: ellipsis;
  color: #62778c;
  ::placeholder {
    font-size: 14px;
  }
`;
