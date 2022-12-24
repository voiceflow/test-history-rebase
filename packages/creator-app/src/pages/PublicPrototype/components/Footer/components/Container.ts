import { BoxFlex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import SpeechBarContainer from '@/pages/Prototype/components/PrototypeSpeechBar/components/Container';

const Container = styled(BoxFlex)`
  min-width: 500px;
  height: 74px;
  margin: 49px 0 0;
  padding: 16px 10px;
  box-shadow: 0 -4px 2px -3px rgba(17, 49, 96, 0.08);
  background-color: white;
  z-index: 2;
  margin: 0 40px;
  flex-direction: row;

  ${SpeechBarContainer} {
    min-height: auto;
  }
`;

export default Container;
