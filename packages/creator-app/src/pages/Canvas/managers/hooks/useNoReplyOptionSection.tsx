import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { NoReplySection } from '@/pages/Canvas/components/NoReply';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformNoReplyFactory } from '@/utils/noReply';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useNoReplyOptionSection = ({
  data,
  onChange,
  pushToPath,
}: NodeInterface<{ nodeID: string; noReply?: Nullable<Realtime.NodeData.NoReply> }>): OptionSection => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext);

  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const toggleNoReply = React.useCallback(async () => {
    const node = engine.getNodeByID(data.nodeID);

    const noReplyPortID = node?.ports.out.builtIn[Models.PortType.NO_REPLY];

    if (data.noReply && noReplyPortID) {
      await engine.port.removeOutBuiltIn(Models.PortType.NO_REPLY, noReplyPortID);
    }

    onChange({ noReply: data.noReply ? null : getPlatformNoReplyFactory(platform)({ defaultVoice }) });
  }, [platform, data.nodeID, data.noReply, onChange, defaultVoice]);

  return [
    {
      label: data.noReply ? 'Remove No Reply' : 'Add No Reply',
      onClick: toggleNoReply,
    },
    !!data.noReply && <NoReplySection data={data.noReply} pushToPath={pushToPath} />,
  ];
};

export default useNoReplyOptionSection;
