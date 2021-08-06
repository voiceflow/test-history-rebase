import React from 'react';

import {
  NODE_ACTIVE_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_THREAD_TARGET_CLASSNAME,
} from '@/pages/Canvas/constants';
import { NodeEntityContext } from '@/pages/Canvas/contexts';

export interface NodeStepStylesProps {
  isHovered: boolean;
  hasLinkWarning: boolean;
}

const NodeStepStyles: React.FC<NodeStepStylesProps> = ({ isHovered, hasLinkWarning }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isActive, isHighlighted, isThreadTarget } = nodeEntity.useState((e) => ({
    isActive: e.isActive,
    isHighlighted: e.isHighlighted,
    isThreadTarget: e.isThreadTarget,
  }));

  nodeEntity.useConditionalStyle(NODE_ACTIVE_CLASSNAME, isActive);
  nodeEntity.useConditionalStyle(NODE_HIGHLIGHTED_CLASSNAME, isHighlighted);
  nodeEntity.useConditionalStyle(NODE_THREAD_TARGET_CLASSNAME, isThreadTarget);
  nodeEntity.useConditionalStyle(NODE_HOVERED_CLASSNAME, isHovered);
  nodeEntity.useConditionalStyle(NODE_DISABLED_CLASSNAME, hasLinkWarning);

  return null;
};

export default React.memo(NodeStepStyles);
