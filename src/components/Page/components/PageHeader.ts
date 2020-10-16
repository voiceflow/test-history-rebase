import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export type PageHeaderProps = {
  noPadding?: boolean;
};

const PageHeader = styled(Flex)<PageHeaderProps>`
  padding: ${({ noPadding }) => (noPadding ? '0' : '0 26px 0 0')};
  height: 70px;
  background: #fff;
`;
export default PageHeader;
