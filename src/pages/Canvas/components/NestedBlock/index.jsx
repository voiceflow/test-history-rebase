import cuid from 'cuid';
import React from 'react';

import { withCanvas } from '@/components/Canvas/contexts';
import { withOverlay } from '@/contexts';
import { withNodeLifecycle } from '@/pages/Canvas/components/Node/hocs';
import { getBlockCategory } from '@/pages/Canvas/constants';
import { withEditPermission, withEngine, withNode } from '@/pages/Canvas/contexts';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

import { Container, Overlay } from './components';

export * from './components';

const NESTED_DRAG_DISTANCE = 5;

class NestedBlock extends React.PureComponent {
  rootRef = React.createRef();

  dragDistance = 0;

  mouseMovement = new MouseMovement();

  api = {
    getPosition: () => {
      const rect = this.rootRef.current.getBoundingClientRect();

      return this.props.engine.canvas.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2]);
    },

    rename: () => this.props.engine.focus.set(this.props.nodeID, { renameActiveRevision: cuid() }),
  };

  onClick = (event) => {
    const { engine, nodeID, overlay } = this.props;

    overlay.dismiss();

    engine.setActivation(nodeID, event.shiftKey);
  };

  onDrag = async (event) => {
    const { engine, nodeID, editPermission } = this.props;

    if (!editPermission.canEdit) {
      return;
    }

    this.mouseMovement.track(event);

    const [movementX, movementY] = this.mouseMovement.getBoundedMovement();

    this.dragDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    if (this.dragDistance > NESTED_DRAG_DISTANCE) {
      const { clientX, clientY } = event;
      await engine.transitionNested(nodeID, engine.canvas.transformPoint([clientX, clientY]));
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
    this.props.engine.registerNode(this.props.node, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expireNode(this.props.nodeID, this.api);
    this.teardownMouseListeners();
  }

  render() {
    const { node, isHighlighted, column, canDrag = true, className, children, ...props } = this.props;

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

export default compose(withNode, withNodeLifecycle, withEngine, withCanvas, withOverlay, withEditPermission)(NestedBlock);
