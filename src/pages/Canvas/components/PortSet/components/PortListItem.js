import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const PortListItem = styled.li`
  ${flexStyles}

  padding: ${({ theme }) => `${theme.unit / 4}px 0`};
`;

export default PortListItem;
