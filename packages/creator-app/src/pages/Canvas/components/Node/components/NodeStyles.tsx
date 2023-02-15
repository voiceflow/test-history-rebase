import React from 'react';

import {
  NODE_ACTIVE_CLASSNAME,
  NODE_DRAGGING_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
  NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME,
  NODE_SELECTED_CLASSNAME,
  NODE_THREAD_TARGET_CLASSNAME,
} from '@/pages/Canvas/constants';
import { NodeEntityContext } from '@/pages/Canvas/contexts';

const NodeStyles: React.FC = () => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isHighlighted, isSelected, isPrototypeHighlighted, isFocused, isMergeTarget, isThreadTarget, isDragging } = nodeEntity.useState((e) => ({
    isHighlighted: e.isHighlighted,
    isSelected: e.isSelected,
    isFocused: e.isFocused,
    isMergeTarget: e.isMergeTarget,
    isThreadTarget: e.isThreadTarget,
    isDragging: e.isDragging,
    isPrototypeHighlighted: e.isPrototypeHighlighted,
  }));

  nodeEntity.useConditionalStyle(NODE_HIGHLIGHTED_CLASSNAME, isHighlighted);
  nodeEntity.useConditionalStyle(NODE_SELECTED_CLASSNAME, isSelected);
  nodeEntity.useConditionalStyle(NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME, isPrototypeHighlighted);
  nodeEntity.useConditionalStyle(NODE_FOCUSED_CLASSNAME, isFocused);
  nodeEntity.useConditionalStyle(NODE_ACTIVE_CLASSNAME, isSelected || isFocused);
  nodeEntity.useConditionalStyle(NODE_MERGE_TARGET_CLASSNAME, isMergeTarget);
  nodeEntity.useConditionalStyle(NODE_THREAD_TARGET_CLASSNAME, isThreadTarget);
  nodeEntity.useConditionalStyle(NODE_DRAGGING_CLASSNAME, isDragging);

  return null;
};

export default React.memo(NodeStyles);
