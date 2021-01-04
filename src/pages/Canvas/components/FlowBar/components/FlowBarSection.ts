import Flex from '@/components/Flex';
import { styled } from '@/hocs';

type FlowBarSectionProps = {
  flexDirection?: 'start' | 'end';
};

const FlowBarSection = styled(Flex)<FlowBarSectionProps>`
  flex: 1;
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
