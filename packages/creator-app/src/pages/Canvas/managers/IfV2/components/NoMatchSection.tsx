import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';

import { IFV2ManagerEditors } from '../subeditors';

export interface NoMatchSectionProps {
  noMatch: BaseNode.IfV2.IfNoMatch;
  pushToPath?: (path: { type: string; label: string }) => void;
}

export const NO_MATCH_TYPE: IFV2ManagerEditors = 'noMatchPath';

const NoMatchSection: React.FC<NoMatchSectionProps> = ({ noMatch, pushToPath }) => {
  const onOpenNoMatchSection = React.useCallback(() => pushToPath && pushToPath({ type: NO_MATCH_TYPE, label: 'No Match' }), [pushToPath]);

  return (
    <Section
      infix={noMatch.type === BaseNode.IfV2.IfNoMatchType.PATH ? 'Path' : ''}
      header="No Match"
      isLink
      onClick={onOpenNoMatchSection}
      headerVariant={HeaderVariant.LINK}
    />
  );
};

export default NoMatchSection;
