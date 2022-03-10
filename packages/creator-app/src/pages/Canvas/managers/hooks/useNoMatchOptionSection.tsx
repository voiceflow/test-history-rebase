import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext, TypeV2Context } from '@/pages/Project/contexts';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useNoMatchOptionSection = ({
  data,
  onChange,
  pushToPath,
}: NodeInterface<{ nodeID: string; noMatch?: Nullable<Realtime.NodeData.NoMatch> }>): OptionSection => {
  const platform = React.useContext(PlatformContext);
  const projectType = React.useContext(TypeV2Context);

  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const toggleNoMatch = React.useCallback(async () => {
    onChange({ noMatch: data.noMatch ? null : getPlatformNoMatchFactory(projectType)({ defaultVoice }) });
  }, [platform, data.nodeID, data.noMatch, onChange, defaultVoice]);

  return [
    {
      label: data.noMatch ? 'Remove No Match' : 'Add No Match',
      onClick: toggleNoMatch,
    },
    !!data.noMatch && <NoMatchSection data={data.noMatch} pushToPath={pushToPath} />,
  ];
};

export default useNoMatchOptionSection;
