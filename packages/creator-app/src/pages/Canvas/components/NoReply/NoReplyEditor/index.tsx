import { Constants } from '@voiceflow/general-types';

import { platformAware } from '@/hocs';

import { ChatForm, VoiceForm } from './components';

const NoReplyResponseForm = platformAware(
  {
    [Constants.PlatformType.CHATBOT]: ChatForm,
  },
  VoiceForm
);

export default NoReplyResponseForm;
