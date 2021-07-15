import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { NodeData } from '@/models';
import { getNoMatchSectionLabel } from '@/pages/Canvas/managers/utils';

import { ChoiceManagerEditors } from '../subeditors';

export interface ElseResponseProps {
  noMatches: NodeData.NoMatches;
  pushToPath: (path: { type: string; label: string }) => void;
}

const TYPE: ChoiceManagerEditors = 'repromptResponse';

const ElseResponse: React.FC<ElseResponseProps> = ({ pushToPath, noMatches }) => {
  const onOpenElseResponse = React.useCallback(() => pushToPath({ type: TYPE, label: 'No Match' }), [pushToPath]);

  return (
    <Section
      infix={getNoMatchSectionLabel(noMatches.type)}
      header="No Match"
      isLink
      onClick={onOpenElseResponse}
      headerVariant={HeaderVariant.LINK}
    />
  );
};

export default ElseResponse;
