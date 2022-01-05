import { Box, BoxFlex, BoxFlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';

export { default as Section } from './Section';

export const FlatCard = styled(Box)`
  padding: 24px 32px;
  border-radius: 5px;
  border: solid 1px #dfe3ed;
  background-color: #fdfdfd;
`;

export const ContentContainer = styled(BoxFlex)`
  flex-direction: column;
  padding: 20px;
  align-items: flex-start;
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
