import cuid from 'cuid';
import React from 'react';

import AddStepButton from '@/pages/Canvas/components/AddStepButton';
import GroupBlock, { Section as GroupBlockSection } from '@/pages/Canvas/components/GroupBlock';
import { MergeStatus } from '@/pages/Canvas/constants';
import { NodeIDProvider, withEditPermission, withEngine, withManager, withNode, withNodeData } from '@/pages/Canvas/contexts';
import { insert } from '@/utils/array';
import { compose } from '@/utils/functional';

// eslint-disable-next-line import/named
import CombinedBlockItem from './components/CombinedBlockItem';
import CombinedBlockLabel from './components/CombinedBlockLabel';
import CombinedBlockPlaceholder from './components/CombinedBlockPlaceholder';

class CombinedBlock extends React.PureComponent {
  static getDerivedStateFromProps({ node }, prevState) {
    if (node.combinedNodes !== prevState.combinedNodeIDs) {
      return { localNodeIDs: node.combinedNodes, combinedNodeIDs: node.combinedNodes, placeholderIndex: null };
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

  updatePlaceholder = (index) => {
    const { engine, node, getManager } = this.props;

    if (index === this.state.placeholderIndex) {
      return;
    }

    if (index === 0 && engine.getNodeByID(node.combinedNodes[0]).ports.in.length === 0) {
      return;
    }

    if (
      index >= node.combinedNodes.length &&
      getManager(engine.getNodeByID(node.combinedNodes[node.combinedNodes.length - 1]).type).mergeTerminator
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
    const { engine, node, getManager } = this.props;

    if (this.canMerge && this.dropContext) {
      this.dragContext = { nodeId: engine.drag.target };

      const targetID = this.dropContext.nodeID;
      const sourceNode = engine.getNodeByID(engine.drag.target);
      const targetIndex = this.state.localNodeIDs.indexOf(targetID);

      if (getManager(sourceNode.type).mergeTerminator) {
        this.updatePlaceholder(node.combinedNodes.length);
      } else if (sourceNode.ports.in.length === 0) {
        this.updatePlaceholder(0);
      } else {
        this.updatePlaceholder(targetIndex);
      }
    }
  };

  onMouseLeave = async () => {
    const { engine } = this.props;

    // dirty hack to fix the issue when mouseleave triggers instead of mouseup
    if (engine.drag.target === null && this.dragContext?.nodeId) {
      const dragTarget = this.dragContext.nodeId;

      this.dragContext = null;

      await this.merge(dragTarget);
    }

    this.abortMerge();
  };

  onMouseUp = () => this.merge(this.props.engine.drag.target);

  onAddBlock = (type) => this.props.engine.node.addNested(this.props.nodeID, cuid(), type);

  updateName = (name) => this.props.engine.node.updateData(this.props.nodeID, { name });

  componentDidUpdate(_, prevState) {
    const { placeholderIndex } = this.state;

    if (placeholderIndex !== prevState.placeholderIndex) {
      this.props.engine.node.redrawNestedLinks(this.props.nodeID);
    }
  }

  merge = async (dragTarget) => {
    const { engine, nodeID } = this.props;
    const { placeholderIndex } = this.state;

    if (placeholderIndex !== null) {
      await engine.node.insertNested(nodeID, placeholderIndex, dragTarget);
    } else if (this.isMerging) {
      engine.showMergeWarning();
    }

    this.abortMerge();

    await engine.drag.reset();
    engine.merge.cancel();
  };

  abortMerge = () => {
    this.dropContext = null;
    this.updatePlaceholder(null);
  };

  render() {
    const { data, isHighlighted, nextSteps, lockOwner, editPermission } = this.props;
    const { localNodeIDs, placeholderIndex } = this.state;
    const hasNextSteps = !!nextSteps.length;
    const canAdd = placeholderIndex === null && editPermission.canEdit && hasNextSteps;

    return (
      <GroupBlock
        isActive={isHighlighted}
        addButton={canAdd && <AddStepButton options={nextSteps} onAdd={this.onAddBlock} />}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={this.nodeRef}
      >
        <GroupBlockSection
          label={
            <CombinedBlockLabel nodeID={this.props.nodeID} lockOwner={lockOwner} ref={this.labelRef} value={data.name} onChange={this.updateName} />
          }
        >
          {localNodeIDs.map((nodeID, index) =>
            nodeID === null ? (
              <CombinedBlockPlaceholder key={nodeID} />
            ) : (
              <NodeIDProvider value={nodeID} key={nodeID}>
                <CombinedBlockItem
                  index={index}
                  showOutPorts={index === localNodeIDs.length - 1}
                  onMouseEnter={this.onMouseEnterItem(nodeID)}
                  onMouseLeave={this.onMouseLeaveItem}
                />
              </NodeIDProvider>
            )
          )}
        </GroupBlockSection>
      </GroupBlock>
    );
  }
}

export default compose(withNode, withNodeData, withEngine, withEditPermission, withManager)(CombinedBlock);
