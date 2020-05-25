import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

const LogoContainer = styled(FlexCenter)`
  border-radius: 50%;
  height: 52px;
  width: 52px;
  background-image: linear-gradient(to bottom, rgba(19, 33, 68, 0.85), #132144);
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  margin-bottom: 21px;
`;

export default LogoContainer;
