import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { NoReplySection } from '@/pages/Canvas/components/NoReply';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformPromptFactory } from '@/utils/prompt';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useNoReplyOptionSection = ({ data, onChange, pushToPath }: NodeInterface<{ reprompt: Realtime.NodeData.Reprompt | null }>): OptionSection => {
  const platform = React.useContext(PlatformContext);
  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const hasNoReply = !!data.reprompt;

  const toggleNoReply = React.useCallback(
    () => onChange({ reprompt: hasNoReply ? null : getPlatformPromptFactory(platform)({ defaultVoice }) }),
    [hasNoReply, onChange, defaultVoice]
  );

  return [
    {
      label: hasNoReply ? 'Remove No Reply Response' : 'Add  No Reply Response',
      onClick: toggleNoReply,
    },
    hasNoReply && <NoReplySection pushToPath={pushToPath} />,
  ];
};

export default useNoReplyOptionSection;
