import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { PushToPath } from '@/pages/Canvas/managers/types';

export { NoMatchPathEditor } from './components';

interface NoMatchPathProps {
  pushToPath?: PushToPath;
  borderBottom?: boolean;
}

const NoMatchPath: React.FC<NoMatchPathProps> = ({ pushToPath, borderBottom }) => {
  const onOpenPath = React.useCallback(() => pushToPath?.({ type: 'noMatchPath', label: 'Path' }), [pushToPath]);

  return <Section borderBottom={borderBottom} header="Path" isLink onClick={onOpenPath} headerVariant={HeaderVariant.LINK} />;
};

export default NoMatchPath;
