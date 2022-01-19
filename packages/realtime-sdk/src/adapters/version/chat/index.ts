import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { Version as ChatVersion } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import baseVersionAdapter from '../base';

// I've copied pasted basically the one from general, since it was using general before, but now this one is okay with the MessageDelay prop
const chatVersionAdapter = createAdapter<ChatVersion.ChatVersion, Version<ChatVersion.ChatVersionData>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...baseVersionAdapter.fromDB(baseVersion),
    status: null,
    session: null,
    settings: { ..._omit(ChatVersion.defaultChatVersionSettings(settings), 'session') },
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.CHATBOT).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default chatVersionAdapter;
