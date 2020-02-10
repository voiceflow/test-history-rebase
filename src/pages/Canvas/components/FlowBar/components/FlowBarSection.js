import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const FlowBarSection = styled(Flex)`
  flex: 1;
  display: flex;
  justify-content: ${({ flexDirection }) => (flexDirection ? `flex-${flexDirection}` : 'center')};
  align-items: center;
  font-size: 15px;
  white-space: nowrap;
  color: #62778c;

  & > span {
    margin-right: 5px;
  }
`;

export default FlowBarSection;
