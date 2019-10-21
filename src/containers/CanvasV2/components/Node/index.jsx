import React from 'react';

import { MAX_CLICK_TRAVEL } from '@/components/Canvas/constants';
import { withCanvas } from '@/components/Canvas/contexts';
import { BlockType, INTERNAL_BLOCKS } from '@/constants';
import Block from '@/containers/CanvasV2/components/Block';
import CommentBlock from '@/containers/CanvasV2/components/CommentBlock';
import { MergeStatusProvider } from '@/containers/CanvasV2/components/MergeOverlay/contexts';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';
import { withEngine, withNode, withStaticContextMenu, withTestingMode } from '@/containers/CanvasV2/contexts';
import { getBoundedMovement, stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import GroupNodeRenderer from './components/GroupNodeRenderer';
import Container from './components/NodeContainer';

export class Node extends React.PureComponent {
  state = {
    isHighlighted: this.props.engine.isActive(this.props.node.id),
    isDragging: false,
  };

  position = [this.props.node.x, this.props.node.y];

  nodeRef = React.createRef();

  blockRef = React.createRef();

  mergeContextRef = React.createRef();

  dragDistance = 0;

  holdingShift = 0;

  api = {
    translate: ([movementX, movementY]) => {
      const nodeEl = this.nodeRef.current;

      const [posX, posY] = this.position;
      const nextPosition = [posX + movementX, posY + movementY];
      this.position = nextPosition;

      // eslint-disable-next-line compat/compat
      window.requestAnimationFrame(() => {
        nodeEl.style.transform = `translate3d(${nextPosition[0]}px, ${nextPosition[1]}px, 0)`;
      });
    },

    highlight: () => this.setState({ isHighlighted: true }),

    clearHighlight: () => this.setState({ isHighlighted: false }),

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
    return this.props.engine.focus.isTarget(this.props.node.id);
  }

  get isSelected() {
    return this.props.engine.selection.isTarget(this.props.node.id);
  }

  addMouseListeners() {
    if (!this.holdingShift) {
      document.addEventListener('mousemove', this.onDrag);
    }

    document.addEventListener('mouseup', this.onMouseUp);
  }

  teardownMouseListeners() {
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

  onMouseUp = () => {
    const { engine, node } = this.props;

    if (this.dragDistance < MAX_CLICK_TRAVEL) {
      this.onClick();
    } else if (engine.drag.isTarget(node.id)) {
      this.onDrop();
    }

    this.dragDistance = 0;
    this.holdingShift = false;
    engine.drag.clear();
    engine.merge.cancel();

    this.teardownMouseListeners();
  };

  onClick = () => {
    const { engine, node } = this.props;

    engine.setActivation(node.id, this.holdingShift);
  };

  onDrag = (event) => {
    const { canvas, engine, node } = this.props;
    const zoom = canvas.getZoom();
    const [movementX, movementY] = getBoundedMovement(event);

    this.dragDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    engine.dragNode(node.id, [movementX / zoom, movementY / zoom]);
  };

  onDrop = () => this.props.engine.dropNode();

  onRightClick = stopPropagation((event) => {
    const { contextMenu, node, isTesting } = this.props;

    if (node.type !== BlockType.START && !isTesting) {
      contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);
    }
  });

  center = () => {
    const { engine, node } = this.props;
    engine.node.center(node.id);
  };

  componentDidMount() {
    const { engine, node } = this.props;

    engine.registerNode(node, this.api);

    if (this.isFocused) {
      this.nodeRef.current.focus();
    }
  }

  componentWillUnmount() {
    const { engine, node } = this.props;

    engine.expireNode(node.id, this.api);
    this.teardownMouseListeners();
  }

  render() {
    const { node } = this.props;
    const { isHighlighted, isDragging } = this.state;
    const shouldRender = node.type !== BlockType.COMMAND;

    if (!shouldRender) {
      return null;
    }

    const renderProps = {
      isActive: isHighlighted,
    };

    let nodeEl = null;

    if (node.type === BlockType.COMMENT) {
      nodeEl = <CommentBlock isActive={isHighlighted} ref={this.blockRef} />;
    } else if (INTERNAL_BLOCKS.includes(node.type)) {
      nodeEl = <GroupNodeRenderer combinedNodeIDs={node.combinedNodes} {...renderProps} ref={this.blockRef} />;
    } else {
      nodeEl = <Block isActive={isHighlighted} ref={this.blockRef} />;
    }

    return (
      <Container
        isActive={isHighlighted}
        isDragging={isDragging}
        position={this.position}
        onMouseDown={this.onMouseDown}
        onContextMenu={this.onRightClick}
        onDoubleClick={this.center}
        ref={this.nodeRef}
        tabIndex={-1}
      >
        <MergeStatusProvider ref={this.mergeContextRef}>{nodeEl}</MergeStatusProvider>
      </Container>
    );
  }
}

export default compose(
  withCanvas,
  withEngine,
  withStaticContextMenu,
  withTestingMode,
  withNode
)(Node);
