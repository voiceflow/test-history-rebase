import cuid from 'cuid';
import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { withEditPermission, withEngine, withNode, withPlatform, withPort } from '@/pages/Canvas/contexts';
import PortLabels from '@/pages/Canvas/managers/labels';
import { swallowEvent } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { Container, Label } from './components';

class Port extends React.PureComponent {
  portRef = React.createRef();

  api = {
    instanceID: cuid(),

    isReady: () => !!this.portRef.current,

    getRect: () => this.portRef.current.getBoundingClientRect(),
  };

  onStartCreateLink = swallowEvent((event) => {
    const { portID, canDrag, editPermission, node, engine } = this.props;
    const canCreateLink = canDrag && editPermission.canEdit && !engine.isNodeMovementLocked(node.id);
    if (canCreateLink) {
      engine.linkCreation.start(portID, mouseEventOffset(event, engine.canvas.getRef()));
    }
  });

  onEndCreateLink = (event) => {
    const { portID, canDrop, engine } = this.props;

    if (engine.linkCreation.isDrawing && canDrop) {
      event.stopPropagation();

      engine.linkCreation.complete(portID);
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
        <Container
          onMouseDown={this.onStartCreateLink}
          onMouseUp={this.onEndCreateLink}
          onClick={this.onStartCreateLink}
          isActive={hasActiveLinks}
          ref={this.portRef}
        />
      </>
    );
  }
}

export default compose(withNode, withPort, withEngine, withPlatform, withEditPermission)(Port);
