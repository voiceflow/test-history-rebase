import cuid from 'cuid';
import React from 'react';

import { BlockType } from '@/constants';
import AddStepButton from '@/containers/CanvasV2/components/AddStepButton';
import GroupBlock, { Section as GroupBlockSection } from '@/containers/CanvasV2/components/GroupBlock';
import { MergeStatus } from '@/containers/CanvasV2/constants';
import { NodeIDProvider, withEngine, withNode, withNodeData, withTestingMode } from '@/containers/CanvasV2/contexts';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';
import { insert, reorder } from '@/utils/array';
import { compose } from '@/utils/functional';

// eslint-disable-next-line import/named
import CombinedBlockItem from './components/CombinedBlockItem';
import CombinedBlockLabel from './components/CombinedBlockLabel';
import CombinedBlockPlaceholder from './components/CombinedBlockPlaceholder';

class CombinedBlock extends React.PureComponent {
  static getDerivedStateFromProps({ node }, prevState) {
    if (node.combinedNodes !== prevState.combinedNodeIDs) {
      return { localNodeIDs: node.combinedNodes, combinedNodeIDs: node.combinedNodes, placeholderIndex: null, reorderContext: null };
    }

    return null;
  }

  api = {
    rename: () => this.labelRef.current.api.enableEditing(),

    getBoundingClientRect: () => this.nodeRef.current.api.getBoundingClientRect(),
  };

  state = {
    localNodeIDs: this.props.node.combinedNodes,
    combinedNodeIDs: this.props.node.combinedNodes,
    placeholderIndex: null,
    reorderContext: null,
  };

  dragContext = null;

  dropContext = null;

  nodeRef = React.createRef();

  labelRef = React.createRef();

  get isMerging() {
    return this.props.engine.merge.isTarget(this.props.nodeID);
  }

  get canMerge() {
    return (
      this.isMerging && (this.props.engine.merge.status === MergeStatus.ACCEPT || this.props.engine.merge.status === MergeStatus.COMBINED_ACCEPT)
    );
  }

  reorderNested = (sourceIndex, targetIndex) => {
    const { engine } = this.props;
    const { localNodeIDs, reorderContext } = this.state;

    const targetNode = engine.getNodeByID(localNodeIDs[targetIndex]);
    const sourceNode = engine.getNodeByID(localNodeIDs[sourceIndex]);

    if (NODE_MANAGERS[sourceNode.type].mergeTerminator || NODE_MANAGERS[targetNode.type].mergeTerminator) {
      return false;
    }

    if (sourceNode.type === BlockType.INTENT || targetNode.type === BlockType.INTENT) {
      return false;
    }

    this.setState({
      reorderContext: reorderContext ? { ...reorderContext, targetIndex } : { sourceIndex, targetIndex },
      localNodeIDs: reorder(localNodeIDs, sourceIndex, targetIndex),
    });

    return true;
  };

  updatePlaceholder = (index) => {
    const { engine, node } = this.props;

    if (index === this.state.placeholderIndex) {
      return;
    }

    if (index === 0 && engine.getNodeByID(node.combinedNodes[0]).ports.in.length === 0) {
      return;
    }

    if (
      index >= node.combinedNodes.length &&
      NODE_MANAGERS[engine.getNodeByID(node.combinedNodes[node.combinedNodes.length - 1]).type].mergeTerminator
    ) {
      return;
    }

    this.setState({
      placeholderIndex: index,
      localNodeIDs: index === null ? node.combinedNodes : insert(node.combinedNodes, index, null),
    });
  };

  onMouseEnterItem = (nodeID) => (event) => {
    if (this.canMerge) {
      this.dropContext = { nodeID, target: event.target };
    }
  };

  onMouseLeaveItem = () => {
    if (this.canMerge) {
      this.dropContext = null;
    }
  };

  onMouseMove = () => {
    const { engine, node } = this.props;

    if (this.canMerge && this.dropContext) {
      this.dragContext = { nodeId: engine.drag.target };

      const targetID = this.dropContext.nodeID;
      const sourceNode = engine.getNodeByID(engine.drag.target);
      const targetIndex = this.state.localNodeIDs.indexOf(targetID);

      if (NODE_MANAGERS[sourceNode.type].mergeTerminator) {
        this.updatePlaceholder(node.combinedNodes.length);
      } else if (sourceNode.ports.in.length === 0) {
        this.updatePlaceholder(0);
      } else {
        this.updatePlaceholder(targetIndex);
      }
    }
  };

  onMouseLeave = () => {
    const { engine } = this.props;

    // dirty hack to fix the issue when mouseleave triggers instead of mouseup
    if (engine.drag.target === null && this.dragContext?.nodeId) {
      const dragTarget = this.dragContext.nodeId;

      this.dragContext = null;

      this.merge(dragTarget);
    }

    this.abortMerge();
  };

  onMouseUp = () => {
    const { engine } = this.props;

    this.merge(engine.drag.target);
  };

  onAddBlock = (type) => this.props.engine.node.addNested(this.props.nodeID, cuid(), type);

  applyReorder = () => {
    const { engine, nodeID } = this.props;
    const { reorderContext } = this.state;

    if (reorderContext) {
      const { sourceIndex, targetIndex } = reorderContext;

      this.setState({ reorderContext: null });
      engine.node.reorderNested(nodeID, sourceIndex, targetIndex);
    }
    return false;
  };

  updateName = (name) => this.props.engine.node.updateData(this.props.nodeID, { name });

  componentDidUpdate(_, prevState) {
    const { placeholderIndex, reorderContext } = this.state;

    if (placeholderIndex !== prevState.placeholderIndex || reorderContext !== prevState.reorderContext) {
      this.props.engine.node.redrawNestedLinks(this.props.nodeID);
    }
  }

  merge = (dragTarget) => {
    const { engine, nodeID } = this.props;
    const { placeholderIndex } = this.state;

    if (placeholderIndex !== null) {
      engine.node.insertNested(nodeID, placeholderIndex, dragTarget);
    } else if (this.isMerging) {
      engine.showMergeWarning();
    }

    this.abortMerge();

    engine.drag.clear();
    engine.merge.cancel();
  };

  abortMerge = () => {
    this.dropContext = null;
    this.updatePlaceholder(null);

    if (this.state.reorderContext) {
      this.setState({ reorderContext: null });
    }
  };

  render() {
    const { data, isHighlighted, nextSteps, isTesting, engine } = this.props;
    const { localNodeIDs, placeholderIndex } = this.state;
    const hasNextSteps = !!nextSteps.length;
    const canAdd = placeholderIndex === null && !isTesting && hasNextSteps;

    return (
      <GroupBlock
        isActive={isHighlighted}
        addButton={canAdd && <AddStepButton options={nextSteps} onAdd={this.onAddBlock} />}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={this.nodeRef}
      >
        <GroupBlockSection label={<CombinedBlockLabel ref={this.labelRef} value={data.name} onChange={this.updateName} />}>
          {localNodeIDs.map((nodeID, index) =>
            nodeID === null ? (
              <CombinedBlockPlaceholder key={nodeID} />
            ) : (
              <NodeIDProvider value={nodeID} key={nodeID}>
                <CombinedBlockItem
                  index={index}
                  showOutPorts={index === localNodeIDs.length - 1}
                  onReorder={this.reorderNested}
                  onMouseEnter={this.onMouseEnterItem(nodeID)}
                  onMouseLeave={this.onMouseLeaveItem}
                  onDrop={this.applyReorder}
                  engine={engine}
                />
              </NodeIDProvider>
            )
          )}
        </GroupBlockSection>
      </GroupBlock>
    );
  }
}

export default compose(
  withNode,
  withNodeData,
  withEngine,
  withTestingMode
)(CombinedBlock);
