import React from 'react';

import { MAX_CLICK_TRAVEL } from '@/components/Canvas/constants';
import { BlockType, INTERNAL_BLOCKS } from '@/constants';
import Block from '@/containers/CanvasV2/components/Block';
import CommentBlock from '@/containers/CanvasV2/components/CommentBlock';
import { MergeStatusProvider } from '@/containers/CanvasV2/components/MergeOverlay/contexts';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';
import { withEngine, withNode, withStaticContextMenu, withTestingMode } from '@/containers/CanvasV2/contexts';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

import GroupNodeRenderer from './components/GroupNodeRenderer';
import Container from './components/NodeContainer';
import { withNodeLifecycle } from './hocs';

export class Node extends React.PureComponent {
  // keep track of changes to location
  static getDerivedStateFromProps(
    {
      node: { x, y },
    },
    { position }
  ) {
    return {
      position: [x, y],
      positionChanged: position[0] !== x || position[1] !== y,
    };
  }

  state = {
    isDragging: false,
    position: [null, null],
    positionChanged: false,
  };

  nodeRef = React.createRef();

  blockRef = React.createRef();

  mergeContextRef = React.createRef();

  position = null;

  dragDistance = 0;

  holdingShift = 0;

  mouseMovement = new MouseMovement();

  api = {
    translate: ([movementX, movementY]) => {
      const [posX, posY] = this.position;
      const nextPosition = [posX + movementX, posY + movementY];
      this.position = nextPosition;

      this.updateTransform(nextPosition);
    },

    setMergeStatus: (mergeStatus) => this.mergeContextRef.current.setStatus(mergeStatus),

    forceDrag: () => {
      this.addMouseListeners();
      this.nodeRef.current.focus();
    },

    drag: () => this.setState({ isDragging: true }),

    drop: () => this.setState({ isDragging: false }),

    getRect: () => this.nodeRef.current.getBoundingClientRect(),

    getBlockRect: () => this.blockRef.current.api.getBoundingClientRect(),

    getPosition: () => this.position,

    rename: () => this.blockRef.current.api.rename?.(),
  };

  get isFocused() {
    return this.props.engine.focus.isTarget(this.props.nodeID);
  }

  get isSelected() {
    return this.props.engine.selection.isTarget(this.props.nodeID);
  }

  updateTransform(position, callback) {
    const nodeEl = this.nodeRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      nodeEl.style.transform = `translate3d(${position[0]}px, ${position[1]}px, 0)`;

      callback?.();
    });
  }

  addMouseListeners() {
    if (!this.holdingShift) {
      document.addEventListener('mousemove', this.onDrag);
    }

    document.addEventListener('mouseup', this.onMouseUp);
  }

  teardownMouseListeners() {
    this.mouseMovement.clear();

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (event) => {
    // don't capture right-click events
    if (event.button !== 2) {
      event.stopPropagation();
      if (!this.props.isTesting) {
        this.holdingShift = event.shiftKey;
        this.addMouseListeners();
      }
    }
  };

  onMouseUp = ({ detail }) => {
    const { engine, nodeID } = this.props;

    // do not click in case double click event
    if (this.dragDistance < MAX_CLICK_TRAVEL && detail !== 2) {
      this.onClick();
    } else if (engine.drag.isTarget(nodeID)) {
      this.onDrop();
    }

    this.dragDistance = 0;
    this.holdingShift = false;
    engine.drag.clear();
    engine.merge.cancel();

    this.teardownMouseListeners();
  };

  onClick = () => this.props.engine.setActivation(this.props.nodeID, this.holdingShift);

  onDrag = (event) => {
    const { engine, nodeID } = this.props;

    this.mouseMovement.track(event);

    const [movementX, movementY] = this.mouseMovement.getBoundedMovement();

    const zoom = engine.canvas.getZoom();

    this.dragDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    engine.dragNode(nodeID, [movementX / zoom, movementY / zoom]);
  };

  onDrop = () => {
    this.props.engine.dropNode();
  };

  onRightClick = stopPropagation((event) => {
    const { contextMenu, nodeID, node, isTesting } = this.props;

    if (node.type !== BlockType.START && !isTesting) {
      contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeID);
    }
  });

  onDoubleClick = () => {
    this.props.engine.node.center(this.props.nodeID);
  };

  componentDidMount() {
    this.props.engine.registerNode(this.props.node, this.api);

    if (this.isFocused) {
      this.nodeRef.current.focus();
    }
  }

  componentWillUnmount() {
    this.props.engine.expireNode(this.props.nodeID, this.api);
    this.teardownMouseListeners();
  }

  componentDidUpdate() {
    // handle undo / redo movement
    if (this.state.positionChanged) {
      const { engine, nodeID } = this.props;

      this.updateTransform(this.position, () => engine.node.redrawLinks(nodeID));
    }
  }

  render() {
    const { node, isHighlighted } = this.props;
    const { isDragging, position, positionChanged } = this.state;
    const shouldRender = node.type !== BlockType.COMMAND;

    if (!shouldRender) {
      return null;
    }

    if (positionChanged) {
      this.position = position;
    }

    let nodeEl = null;

    if (node.type === BlockType.COMMENT) {
      nodeEl = <CommentBlock ref={this.blockRef} />;
    } else if (INTERNAL_BLOCKS.includes(node.type)) {
      nodeEl = <GroupNodeRenderer combinedNodeIDs={node.combinedNodes} ref={this.blockRef} />;
    } else {
      nodeEl = <Block ref={this.blockRef} />;
    }

    return (
      <Container
        isActive={isHighlighted}
        isDragging={isDragging}
        position={position}
        onMouseDown={this.onMouseDown}
        onContextMenu={this.onRightClick}
        onDoubleClick={this.onDoubleClick}
        ref={this.nodeRef}
        tabIndex={-1}
      >
        <MergeStatusProvider ref={this.mergeContextRef}>{nodeEl}</MergeStatusProvider>
      </Container>
    );
  }
}

export default compose(
  withStaticContextMenu,
  withNode,
  withNodeLifecycle,
  withEngine,
  withTestingMode
)(Node);
