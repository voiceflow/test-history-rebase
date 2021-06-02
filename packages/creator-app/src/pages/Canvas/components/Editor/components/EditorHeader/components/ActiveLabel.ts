import { flexLabelStyles } from '@/components/Flex';
import { styled, transition } from '@/hocs';

const ActiveLabel = styled.span`
  ${flexLabelStyles}
  ${transition('color')}
  color: #4986da;
  cursor: default;
  text-decoration: underline;
`;

export default ActiveLabel;
