import React from 'react';

import { NODE_DISABLED_CLASSNAME, NODE_HOVERED_CLASSNAME } from '@/pages/Canvas/constants';
import { NodeEntityContext } from '@/pages/Canvas/contexts';

export type NodeBlockStylesProps = {
  isHovered: boolean;
  hasLinkWarning: boolean;
};

const NodeBlockStyles: React.FC<NodeBlockStylesProps> = ({ isHovered, hasLinkWarning }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const isDisabled = isHovered && hasLinkWarning;

  nodeEntity.useConditionalStyle(NODE_HOVERED_CLASSNAME, isHovered);
  nodeEntity.useConditionalStyle(NODE_DISABLED_CLASSNAME, isDisabled);

  return null;
};

export default React.memo(NodeBlockStyles);
