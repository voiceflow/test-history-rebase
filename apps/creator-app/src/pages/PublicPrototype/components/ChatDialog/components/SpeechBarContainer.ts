import { styled } from '@/hocs/styled';
import PrototypeSpeechBarContainer from '@/pages/Prototype/components/PrototypeSpeechBar/components/Container';

const SpeechBarContainer = styled.div`
  margin: -16px 0 -16px -24px;
  flex: 2;

  ${PrototypeSpeechBarContainer} {
    padding: 16px 0 16px 24px;
  }
`;

export default SpeechBarContainer;
