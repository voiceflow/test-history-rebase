import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { PushToPath } from '@/pages/Canvas/managers/types';

interface NoMatchPathProps {
  pushToPath?: PushToPath;
  borderBottom?: boolean;
}

export const NO_MATCH_PATH_PATH_TYPE = 'noMatchPath';

const NoMatchPath: React.FC<NoMatchPathProps> = ({ pushToPath, borderBottom }) => {
  const onOpenPath = React.useCallback(() => pushToPath?.({ type: NO_MATCH_PATH_PATH_TYPE, label: 'Path' }), [pushToPath]);

  return <Section borderBottom={borderBottom} header="Path" isLink onClick={onOpenPath} headerVariant={HeaderVariant.LINK} />;
};

export default NoMatchPath;
