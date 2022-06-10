import { Box, SectionV2 } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const IntegrationEditorSectionItem = styled(Box)`
  width: 100%;
  display: grid;
  grid-gap: 16px;
`;

export const IntegrationEditorSectionDivider = styled(SectionV2.Divider)`
  width: 100vw;
  margin-top: 20px;
  margin-bottom: 20px;
`;
