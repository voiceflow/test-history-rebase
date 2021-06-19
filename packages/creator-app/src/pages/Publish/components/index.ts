import Box, { Flex, FlexCenter } from '@/components/Box';
import Text from '@/components/Text';
import { styled } from '@/hocs';

export const SectionCard = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: white;
  padding: 24px;

  ${Text} {
    color: #62778c;
  }
`;

export const ContentContainer = styled(Flex)`
  flex-direction: column;
  padding: 20px;
`;

export const ContentSection = styled(FlexCenter)`
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
