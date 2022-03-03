import { Box, Input } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(Box)`
  flex: 5;
  border-right: solid 1px #dfe3ed;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const NLUButton = styled(Box)`
  cursor: pointer;
  padding: 22px 32px;
  background: #eef4f6;
  border-top: solid 1px #dfe3ed;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled(Input)`
  border: none;
  padding: 21.5px 24px;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
`;
