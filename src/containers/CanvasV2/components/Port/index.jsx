import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { withCanvas } from '@/components/Canvas/contexts';
import { withEditPermission, withEngine, withLinkCreation, withNode, withPlatform, withPort } from '@/containers/CanvasV2/contexts';
import PortLabels from '@/containers/CanvasV2/managers/labels';
import { swallowEvent } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { Container, Label } from './components';

class Port extends React.PureComponent {
  portRef = React.createRef();

  api = {
    getRect: () => this.portRef.current.getBoundingClientRect(),
  };

  onMouseDown = swallowEvent((event) => {
    const { portID, canvas, canDrag, linkCreation, editPermission, node, engine } = this.props;
    const canCreateLink = canDrag && editPermission.canEdit && !engine.isNodeMovementLocked(node.id);
    if (canCreateLink) {
      linkCreation.onStart(portID, mouseEventOffset(event, canvas.getRef()));
    }
  });

  onMouseUp = (event) => {
    const { portID, canDrop, linkCreation } = this.props;

    if (linkCreation.isDrawing && canDrop) {
      event.stopPropagation();

      linkCreation.onComplete(portID);
    }
  };

  componentDidMount() {
    this.props.engine.registerPort(this.props.portID, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expirePort(this.props.portID, this.api);
  }

  render() {
    const { port, hasActiveLinks, index, node, platform, withLabel } = this.props;

    const getPortLabel = PortLabels[node.type] || (({ label }) => label);
    const label = withLabel && getPortLabel(port, index, platform);

    return (
      <>
        {label && <Label>{label}</Label>}
        <Container onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} isActive={hasActiveLinks} ref={this.portRef} />
      </>
    );
  }
}

export default compose(
  withNode,
  withPort,
  withCanvas,
  withEngine,
  withPlatform,
  withEditPermission,
  withLinkCreation
)(Port);
