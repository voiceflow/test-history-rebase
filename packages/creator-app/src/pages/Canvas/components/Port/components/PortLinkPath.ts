import { styled } from '@/hocs';
import LinkPath from '@/pages/Canvas/components/Link/components/LinkPath';

export interface PortLinkPathProps {
  isHighlighted: boolean;
}

const PortLinkPath = styled(LinkPath)<PortLinkPathProps>`
  transform: translateY(-2px);
`;

export default PortLinkPath;
