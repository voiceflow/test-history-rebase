import { FlexCenter } from '@/components/Box';
import { styled } from '@/hocs';
import { Fade } from '@/styles/animations';

const PlaceholderContainer = styled(FlexCenter)`
  ${Fade}
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default PlaceholderContainer;
