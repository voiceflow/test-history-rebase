import { flexLabelStyles } from '@/components/Flex';
import { styled, transition } from '@/hocs';

const ActiveLabel = styled.span`
  ${flexLabelStyles}
  ${transition('color')}
  color: #5d9df5;
  cursor: default;
`;

export default ActiveLabel;
