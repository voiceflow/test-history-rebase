import composeRefs from '@seznam/compose-react-refs';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';
import BlockPlayButton from '@/pages/Canvas/components/BlockPlayButton';
import { NodeEntityProvider, PortEntityProvider } from '@/pages/Canvas/contexts';
import { CombinedAPI } from '@/pages/Canvas/types';

import { useCombined } from '../hooks';
import NodePort from '../NodePort';
import NodeStep from '../NodeStep';
import { ReorderIndicator, SourceReorderIndicator, TerminalReorderIndicator } from './components';

const NodeBlock: React.ForwardRefRenderFunction<CombinedAPI> = (_, ref) => {
  const {
    name,
    palette,
    onClick,
    onRename,
    onInsert,
    onDropRef,
    nodeEntity,
    isDisabled,
    wrapElement,
    combinedRef,
    combinedNodes,
    hoverHandlers,
    isMergeTarget,
    hasLinkWarning,
    getAnchorPoint,
  } = useCombined({ defaultBlockColor: COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR });

  return (
    <>
      {nodeEntity.inPortID && !hasLinkWarning && (
        <PortEntityProvider id={nodeEntity.inPortID}>
          <NodePort getAnchorPoint={getAnchorPoint} />
        </PortEntityProvider>
      )}

      {wrapElement(
        <Block
          ref={composeRefs(ref, combinedRef, onDropRef)}
          name={name || 'Block'}
          nodeID={nodeEntity.nodeID}
          actions={<BlockPlayButton nodeID={combinedNodes[0]} palette={palette} />}
          palette={palette}
          onClick={onClick}
          onRename={onRename}
          isDisabled={isDisabled}
          canEditTitle
          {...hoverHandlers}
        >
          {combinedNodes.map((stepNodeID, index) => (
            <NodeEntityProvider id={stepNodeID} key={stepNodeID}>
              {index === 0 && <SourceReorderIndicator isEnabled={isMergeTarget} index={0} onMouseUp={onInsert(0)} palette={palette} />}

              <NodeStep isDraggable isLast={index === combinedNodes.length - 1} palette={palette} />

              {index === combinedNodes.length - 1 ? (
                <TerminalReorderIndicator isEnabled={isMergeTarget} index={index + 1} onMouseUp={onInsert(index + 1)} palette={palette} />
              ) : (
                <ReorderIndicator isEnabled={isMergeTarget} index={index + 1} onMouseUp={onInsert(index + 1)} palette={palette} />
              )}
            </NodeEntityProvider>
          ))}
        </Block>
      )}
    </>
  );
};

export default React.forwardRef(NodeBlock);
