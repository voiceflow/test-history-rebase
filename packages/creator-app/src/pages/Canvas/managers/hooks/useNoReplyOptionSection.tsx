import React from 'react';

import { NodeData } from '@/models/NodeData';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useNoReplyOptionSection = ({ data, onChange, pushToPath }: NodeInterface<{ reprompt: NodeData.Reprompt | null }>): OptionSection => {
  const hasNoReply = !!data.reprompt;
  const toggleNoReply = React.useCallback(() => onChange({ reprompt: hasNoReply ? null : repromptFactory() }), [hasNoReply, onChange]);

  return [
    {
      label: hasNoReply ? 'Remove No Reply Response' : 'Add  No Reply Response',
      onClick: toggleNoReply,
    },
    hasNoReply && <NoReplyResponse pushToPath={pushToPath!} />,
  ];
};

export default useNoReplyOptionSection;
