import mouseEventOffset from 'mouse-event-offset';
import React from 'react';
import { withProps } from 'recompose';

import { withCanvas } from '@/components/Canvas/contexts';
import { withEngine, withLinkCreation, withNodeWithoutData, withPlatform, withTestingMode } from '@/containers/CanvasV2/contexts';
import PortLabels from '@/containers/CanvasV2/managers/labels';
import { swallowEvent } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { Container, Label } from './components';

class Port extends React.PureComponent {
  static getDerivedStateFromProps({ engine, port }) {
    return {
      hasLinks: port && engine.port.hasActiveLinks(port.id),
    };
  }

  state = {
    hasLinks: this.props.hasLinks,
  };

  portRef = React.createRef();

  api = {
    getRect: () => this.portRef.current.getBoundingClientRect(),

    redraw: () => {
      const hasLinks = this.props.engine.port.hasActiveLinks(this.props.port.id);

      if (hasLinks !== this.state.hasLinks) {
        this.setState({ hasLinks });
      }
    },
  };

  onMouseDown = swallowEvent((event) => {
    const { port, canvas, canDrag, linkCreation, isTesting } = this.props;

    if (canDrag && !isTesting) {
      linkCreation.onStart(port.id, mouseEventOffset(event, canvas.getRef()));
    }
  });

  onMouseUp = (event) => {
    const { port, canDrop, linkCreation } = this.props;

    if (linkCreation.isDrawing && canDrop) {
      event.stopPropagation();

      linkCreation.onComplete(port.id);
    }
  };

  componentDidMount() {
    this.props.engine.registerPort(this.props.port, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expirePort(this.props.portID, this.api);
  }

  componentDidUpdate(prevProps) {
    const { node, port, engine } = this.props;

    if (prevProps.node.ports !== node.ports) {
      const { hasLinks } = this.state;

      if (hasLinks) {
        engine.port.redrawLinks(port.id);
      }
    }
  }

  render() {
    const { port, index, node, platform, withLabel } = this.props;
    const { hasLinks } = this.state;
    const getPortLabel = PortLabels[node.type] || (({ label }) => label);

    if (!port) {
      return null;
    }

    const label = withLabel && getPortLabel(port, index, platform);

    return (
      <>
        {label && <Label>{label}</Label>}
        <Container onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} isActive={hasLinks} ref={this.portRef} />
      </>
    );
  }
}

export default compose(
  withNodeWithoutData,
  withCanvas,
  withEngine,
  withPlatform,
  withTestingMode,
  withLinkCreation,
  withProps(({ portID, engine }) => ({
    port: engine.getPortByID(portID),
    hasLinks: engine.port.hasActiveLinks(portID),
  }))
)(Port);
