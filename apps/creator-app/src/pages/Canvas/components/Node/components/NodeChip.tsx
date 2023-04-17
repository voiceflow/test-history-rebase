import composeRefs from '@seznam/compose-react-refs';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import { NodeEntityProvider } from '@/pages/Canvas/contexts';
import { CombinedAPI } from '@/pages/Canvas/types';

import { useCombined } from './hooks';
import NodeChipStep from './NodeChipStep';

const NodeChip = React.forwardRef<CombinedAPI>((_, ref) => {
  const {
    name,
    palette,
    onClick,
    onRename,
    onDropRef,
    isHovered,
    isDisabled,
    wrapElement,
    combinedRef,
    combinedNodes,
    hoverHandlers,
    hasLinkWarning,
  } = useCombined({ defaultBlockColor: COLOR_PICKER_CONSTANTS.CHIP_STANDARD_COLOR });

  return (
    <NodeEntityProvider id={combinedNodes[0]} key={combinedNodes[0]}>
      {wrapElement(
        <NodeChipStep
          {...hoverHandlers}
          ref={composeRefs(ref, combinedRef, onDropRef)}
          name={name}
          palette={palette}
          onClick={onClick}
          onRename={onRename}
          isHovered={isHovered}
          isDisabled={isDisabled}
          hasLinkWarning={hasLinkWarning}
        />
      )}
    </NodeEntityProvider>
  );
});

export default NodeChip;
