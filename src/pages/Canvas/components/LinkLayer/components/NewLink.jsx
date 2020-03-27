import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import LinkHeadMarker from '@/pages/Canvas/components/Link/components/LinkHeadMarker';
import LinkPath from '@/pages/Canvas/components/Link/components/LinkPath';
import { buildPath } from '@/pages/Canvas/components/Link/utils';
import { withEngine } from '@/pages/Canvas/contexts';
import { compose } from '@/utils/functional';

class NewLink extends React.PureComponent {
  linkRef = React.createRef();

  points = null;

  isPinned = false;

  state = {
    isVisible: false,
  };

  api = {
    show: () => {
      const { engine, moveLink } = this.props;

      this.points = engine.linkCreation.getLinkEnd();
      moveLink({ points: this.points });

      this.setState({ isVisible: true });

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    hide: () => {
      this.removeEventListeners();
      this.props.moveLink({ reset: true });
      this.setState({ isVisible: false });
    },
    pin: (position) => {
      this.isPinned = true;

      const [start] = this.points;

      const nextPoints = [start, position];
      this.points = nextPoints;
      this.props.moveLink({ points: this.points });
      const linkEl = this.linkRef.current;

      // eslint-disable-next-line compat/compat
      window.requestAnimationFrame(() => linkEl.setAttribute('d', buildPath(nextPoints)));
    },
    unpin: () => {
      this.isPinned = false;
    },
  };

  onMouseMove = (event) => {
    if (this.isPinned) return;

    const { engine } = this.props;

    const [endX, endY] = engine.canvas.transformPoint(mouseEventOffset(event, engine.canvas.getRef()), true);

    const [start] = this.points;

    const nextPoints = [start, [endX, endY]];
    this.points = nextPoints;
    this.props.moveLink({ points: this.points });
    const linkEl = this.linkRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => linkEl.setAttribute('d', buildPath(nextPoints)));
  };

  onMouseUp = (event) => {
    const { engine } = this.props;

    if (engine.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN) && engine.linkCreation.activeTargetPortID) {
      engine.linkCreation.complete(engine.linkCreation.activeTargetPortID);
      event.preventDefault();
    } else if (!engine.linkCreation.isCompleting) {
      engine.linkCreation.abort();
    }
  };

  removeEventListeners() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  componentWillMount() {
    this.props.engine.linkCreation.registerNewLink(this.api);
  }

  componentWillUnmount() {
    this.props.engine.linkCreation.registerNewLink(null);
    this.removeEventListeners();
  }

  render() {
    const { engine } = this.props;
    const { isVisible } = this.state;
    const isBlockRedesignEnabled = engine.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN);

    if (!this.points || !isVisible) {
      return null;
    }

    const path = buildPath(this.points);

    const linkHeadProps = isBlockRedesignEnabled ? { color: '#2c85ff' } : {};
    const linkProps = isBlockRedesignEnabled ? { strokeColor: '#2c85ff' } : {};

    return (
      <>
        <LinkHeadMarker id="newLink" {...linkHeadProps} />
        <LinkPath d={path} markerEnd="url(#head-newLink)" ref={this.linkRef} {...linkProps} />
      </>
    );
  }
}

const mapDispatchToProps = {
  moveLink: (movement) => Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink(movement)),
};

export default compose(withEngine, connect(null, mapDispatchToProps))(NewLink);
