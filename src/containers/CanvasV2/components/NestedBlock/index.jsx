import cuid from 'cuid';
import React from 'react';

import { withCanvas } from '@/components/Canvas/contexts';
import { getBlockCategory } from '@/containers/CanvasV2/constants';
import { withEngine, withNode, withTestingMode } from '@/containers/CanvasV2/contexts';
import { withOverlay } from '@/contexts';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

import { Container, Overlay } from './components';

export * from './components';

const NESTED_DRAG_DISTANCE = 5;

class NestedBlock extends React.PureComponent {
  state = {
    isHighlighted: this.props.engine.isActive(this.props.node.id),
  };

  rootRef = React.createRef();

  dragDistance = 0;

  mouseMovement = new MouseMovement();

  api = {
    highlight: () => this.setState({ isHighlighted: true }),

    clearHighlight: () => this.setState({ isHighlighted: false }),

    getPosition: () => {
      const rect = this.rootRef.current.getBoundingClientRect();

      return this.props.engine.canvas.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2]);
    },

    rename: () => this.props.engine.focus.set(this.props.node.id, { renameActiveRevision: cuid() }),
  };

  onClick = (event) => {
    const { engine, node, overlay } = this.props;

    overlay.dismiss();

    engine.setActivation(node.id, event.shiftKey);
  };

  onDrag = (event) => {
    const { engine, node, isTesting } = this.props;

    if (isTesting) {
      return;
    }

    this.mouseMovement.track(event);

    const [movementX, movementY] = this.mouseMovement.getBoundedMovement();

    this.dragDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    if (this.dragDistance > NESTED_DRAG_DISTANCE) {
      const { clientX, clientY } = event;
      engine.transitionNested(node.id, engine.canvas.transformPoint([clientX, clientY]));
      this.teardownMouseListeners();
    }
  };

  onMouseUp = () => {
    this.dragDistance = 0;
    this.teardownMouseListeners();
  };

  onMouseDown = (event) => {
    if (event.button !== 2) {
      event.stopPropagation();

      if (!event.shiftKey) {
        document.addEventListener('mousemove', this.onDrag);
      }

      document.addEventListener('mouseup', this.onMouseUp);
    }
  };

  teardownMouseListeners() {
    this.mouseMovement.clear();

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidMount() {
    const { engine, node } = this.props;

    engine.registerNode(node, this.api);
    engine.node.redrawLinks(node.id);
  }

  componentWillUnmount() {
    this.props.engine.expireNode(this.props.node.id, this.api);
    this.teardownMouseListeners();
  }

  render() {
    const { node, data: _data, column, canDrag = true, className, children, ...props } = this.props;
    const { isHighlighted } = this.state;
    const { color } = getBlockCategory(node.type);

    return (
      <Container
        onClick={stopPropagation(this.onClick)}
        onMouseDown={canDrag ? stopPropagation(this.onMouseDown) : null}
        onMouseUp={stopPropagation()}
        column={column}
        className={className}
        ref={this.rootRef}
        {...props}
      >
        {children}
        <Overlay isSelected={isHighlighted} color={color} />
      </Container>
    );
  }
}

export default compose(
  withEngine,
  withCanvas,
  withOverlay,
  withTestingMode,
  withNode
)(NestedBlock);
