import { styled } from '@/hocs';
import { Path } from '@/pages/Canvas/components/Link';

export type PortLinkPathProps = {
  isHighlighted: boolean;
};

const PortLinkPath = styled(Path)<PortLinkPathProps>`
  transform: translateY(-2px);
`;

export default PortLinkPath;
