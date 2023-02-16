import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { PushToPath } from '@/pages/Canvas/managers/types';

interface FollowPathPathProps {
  type: string;
  pushToPath?: PushToPath;
}

const FollowPathSection: React.FC<FollowPathPathProps> = ({ type, pushToPath }) => {
  const onOpenPath = React.useCallback(() => pushToPath?.({ type, label: 'Path' }), [type, pushToPath]);

  return <Section header="Path" isLink onClick={onOpenPath} headerVariant={HeaderVariant.LINK} />;
};

export default FollowPathSection;
