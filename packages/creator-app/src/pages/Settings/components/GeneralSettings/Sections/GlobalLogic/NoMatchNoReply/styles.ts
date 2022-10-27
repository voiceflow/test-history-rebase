import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`;

export const SubSectionTitle = styled.b`
  font-size: 15px;
  line-height: 1;
  font-weight: 600;
  color: #132144;
`;

export const SubSectionDescription = styled.p`
  font-size: 13px;
  color: #62778c;
  margin-bottom: 0;
`;
