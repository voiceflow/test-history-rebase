import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { getNoMatchSectionLabel } from '@/pages/Canvas/managers/utils';

import { IFV2ManagerEditors } from '../subeditors';

export interface NoMatchSectionProps {
  noMatch: Realtime.NodeData.BaseNoMatches;
  pushToPath?: (path: { type: string; label: string }) => void;
}

const TYPE: IFV2ManagerEditors = 'noMatchPath';

const NoMatchSection: React.FC<NoMatchSectionProps> = ({ noMatch, pushToPath }) => {
  const onOpenNoMatchSection = React.useCallback(() => pushToPath && pushToPath({ type: TYPE, label: 'No Match' }), [pushToPath]);

  return (
    <Section
      infix={getNoMatchSectionLabel(noMatch.type)}
      header="No Match"
      isLink
      onClick={onOpenNoMatchSection}
      headerVariant={HeaderVariant.LINK}
    />
  );
};

export default NoMatchSection;
