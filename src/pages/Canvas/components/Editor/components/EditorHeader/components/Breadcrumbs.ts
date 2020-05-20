import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const Breadcrumbs = styled.div.attrs({ fullWidth: true })`
  ${flexStyles}
  text-transform: capitalize;
  margin-bottom: 5px;
`;

export default Breadcrumbs;
