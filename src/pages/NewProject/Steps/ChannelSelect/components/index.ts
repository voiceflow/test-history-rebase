import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export const QuestionContainer = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-top: 100px;
  color: #132144;
`;

export const InstructionContainer = styled.div`
  font-size: 15px;
  color: #62778c;
  margin-top: 16px;
`;

export const PlatformCardsContainer = styled(Flex)`
  flex-direction: row;
  margin-top: 40px;
  flex-wrap: wrap;
`;
