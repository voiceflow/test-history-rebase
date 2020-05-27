import React from 'react';

import { LINK_ACTIVE_CLASSNAME, LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';
import { LinkEntityContext } from '@/pages/Canvas/contexts';

const LinkStyles = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;
  const { isHighlighted, isActive } = linkEntity.useState((e) => ({
    isHighlighted: e.isHighlighted,
    isActive: e.isActive,
  }));

  linkEntity.useConditionalStyle(LINK_HIGHLIGHTED_CLASSNAME, isHighlighted);
  linkEntity.useConditionalStyle(LINK_ACTIVE_CLASSNAME, isActive);

  return null;
};

export default React.memo(LinkStyles);
