import { Box, BoxFlex, BoxFlexCenter, Text } from '@voiceflow/ui';

import { styled } from '@/hocs';
import THEME from '@/styles/theme';

export const SectionCard = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: white;
  padding: 24px;

  ${Text} {
    color: ${THEME.colors.secondary};
  }
`;

export const ContentContainer = styled(BoxFlex)`
  flex-direction: column;
  padding: 20px;
`;

export const ContentSection = styled(BoxFlexCenter)`
  margin-bottom: 20px;
  width: 724px;
  align-items: flex-end;
`;

export const ActionContainer = styled.div`
  width: 250px;
  position: relative;

  & > div {
    float: right;
  }
`;
