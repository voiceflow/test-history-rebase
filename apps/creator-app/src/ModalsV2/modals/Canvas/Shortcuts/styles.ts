import { FlexApart } from '@voiceflow/ui';

import { variableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs/styled';

export const ShortcutTitle = styled.div`
  font-weight: 500;
  font-size: 15px;
`;

export const ShortcutContainer = styled(FlexApart)`
  padding: 10px 0;
  color: #132144;
  font-size: 13px;
  font-weight: 600;
`;

export const ShortcutCommand = styled.span`
  ${variableStyle}
  display: inline-flex;
  height: 24px;
  min-width: 24px;
  justify-content: center;
  align-items: center;
  padding-top: 1px;
`;
