import { flexStyles } from '@/components/Flex';
import { Link } from '@/components/Text';
import { styled } from '@/hocs';

const DocsLink = styled(Link)`
  ${flexStyles};

  position: relative;
  color: #62778c;
  align-items: start;

  span {
    top: 4px;
    position: relative;
    margin-right: 12px;
  }
`;

export default DocsLink;
