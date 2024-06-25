import React from 'react';

import {
  NODE_ACTIVE_CLASSNAME,
  NODE_DRAGGING_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
  NODE_SELECTED_CLASSNAME,
} from '@/pages/Canvas/constants';
import { NodeEntityContext } from '@/pages/Canvas/contexts';

const NodeStyles: React.FC = () => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isSelected, isFocused, isDragging } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
    isSelected: e.isSelected,
    isDragging: e.isDragging,
  }));

  nodeEntity.useConditionalStyle(NODE_SELECTED_CLASSNAME, isSelected);
  nodeEntity.useConditionalStyle(NODE_FOCUSED_CLASSNAME, isFocused);
  nodeEntity.useConditionalStyle(NODE_ACTIVE_CLASSNAME, isSelected || isFocused);
  nodeEntity.useConditionalStyle(NODE_DRAGGING_CLASSNAME, isDragging);

  return null;
};

export default React.memo(NodeStyles);
