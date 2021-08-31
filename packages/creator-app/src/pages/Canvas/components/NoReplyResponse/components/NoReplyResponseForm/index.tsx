import { PlatformType } from '@voiceflow/internal';

import { platformAware } from '@/hocs';

import { ChatForm, VoiceForm } from './components';

const NoReplyResponseForm = platformAware(
  {
    [PlatformType.CHATBOT]: ChatForm,
  },
  VoiceForm
);

export default NoReplyResponseForm;
