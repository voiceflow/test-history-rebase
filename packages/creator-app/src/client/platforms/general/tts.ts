import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import axios from 'axios';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

const ttsGeneralService = {
  convert: ({ ssml, voiceID, platform }: { ssml: string; voiceID: string; platform?: VoiceflowConstants.PlatformType }) =>
    axios.post<{ src?: null | string }[]>(`${GENERAL_SERVICE_ENDPOINT}/tts/convert`, { ssml, voiceID, platform }).then((res) => res.data),
};

export default ttsGeneralService;
