import { Box, SectionV2 } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const IntegrationEditorSectionItem = styled(Box)`
  width: 100%;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

export const IntegrationEditorSectionDivider = styled(SectionV2.Divider)`
  width: calc(100% + 32px);
  margin-top: 20px;
  margin-bottom: 20px;
`;
