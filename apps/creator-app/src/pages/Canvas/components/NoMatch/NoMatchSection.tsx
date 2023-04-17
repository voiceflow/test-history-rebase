import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { getNoMatchNoReplySectionLabel } from '@/pages/Canvas/managers/utils/noMatchNoReply';

export interface NoMatchSectionProps {
  data: Realtime.NodeData.NoMatch;
  pushToPath?: (path: { type: string; label: string }) => void;
}

export const NO_MATCH_PATH_TYPE = 'noMatch';

const NoMatchSection: React.FC<NoMatchSectionProps> = ({ data, pushToPath }) => {
  const onClick = React.useCallback(() => pushToPath?.({ type: NO_MATCH_PATH_TYPE, label: 'No match' }), [pushToPath]);

  return (
    <Section
      infix={<>{getNoMatchNoReplySectionLabel(BaseNode.Utils.NoMatchType, data.types)}</>}
      header="No Match"
      isLink
      onClick={onClick}
      headerVariant={HeaderVariant.LINK}
    />
  );
};

export default NoMatchSection;
