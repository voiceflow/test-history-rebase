import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { NodeData } from '@/models';
import { getNoMatchSectionLabel } from '@/pages/Canvas/managers/utils';

export interface NoMatchSectionProps {
  data: NodeData.NoMatchPrompt;
  pushToPath?: (path: { type: string; label: string }) => void;
}

export const NO_MATCH_PATH_TYPE = 'noMatch';

const NoMatchSection: React.FC<NoMatchSectionProps> = ({ data, pushToPath }) => {
  const onClick = React.useCallback(() => pushToPath?.({ type: NO_MATCH_PATH_TYPE, label: 'No Match' }), [pushToPath]);

  return <Section infix={getNoMatchSectionLabel(data.type)} header="No Match" isLink onClick={onClick} headerVariant={HeaderVariant.LINK} />;
};

export default NoMatchSection;
