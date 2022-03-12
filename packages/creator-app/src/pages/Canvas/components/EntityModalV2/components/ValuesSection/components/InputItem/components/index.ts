import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled.div`
  padding: 11px 16px;
  border: solid 1px #d4d9e6;
  border-radius: 5px;
  flex: 2;
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
