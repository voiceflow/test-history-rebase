import { flexStyles } from '@/components/Flex';
import { Link } from '@/components/Text';
import { styled, units } from '@/hocs';

export const DocsLink = styled(Link)`
  ${flexStyles};

  position: absolute;
  left: 50px;
  bottom: ${units(5)}px;
  color: #62778c;

  span {
    margin-right: 12px;
  }
`;
