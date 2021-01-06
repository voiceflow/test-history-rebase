import Flex from '@/components/Flex';
import { styled } from '@/hocs';

import DefaultVoiceContainer from './DefaultVoiceContainer';

const VoiceItem = styled(Flex)`
  margin-left: -36px;
  margin-right: -24px;
  padding-left: 36px;
  padding-right: 56px;
  flex: 1;
  height: 100%;

  &:hover {
    ${DefaultVoiceContainer} {
      opacity: 1;
    }
  }
`;

export default VoiceItem;
