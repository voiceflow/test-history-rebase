import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import DefaultVoiceContainer from './DefaultVoiceContainer';

const VoiceItem = styled(Flex)`
  margin-left: -36px;
  margin-right: -24px;
  padding-left: 36px;
  padding-right: 56px;
  flex: 1;
  height: 100%;
  min-width: 175px;

  &:hover {
    ${DefaultVoiceContainer} {
      opacity: 1;
    }
  }
`;

export default VoiceItem;
