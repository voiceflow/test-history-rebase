import React from 'react';

import { connect } from '@/hocs';
import { withEngine } from '@/pages/Canvas/contexts';
import { diagramViewersLookupSelector } from '@/store/selectors';
import { append, withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';

class AbstractOverlay extends React.PureComponent {
  state = {
    items: [],
  };

  itemRefs = {};

  constructor(overlayType, props) {
    super(props);

    this.overlayType = overlayType;
  }

  getElement(tabID) {
    return this.itemRefs[tabID]?.current;
  }

  animateElement(tabID, animate) {
    if (this.state.items.includes(tabID)) {
      const itemEl = this.getElement(tabID);

      // eslint-disable-next-line compat/compat
      window.requestAnimationFrame(() => animate(itemEl));
    } else if (!this.unmounted) {
      this.itemRefs[tabID] = React.createRef();
      this.setState({ items: append(this.state.items, tabID) });
    }
  }

  componentDidMount() {
    this.props.engine.realtime.registerOverlay(this.overlayType, this.api);
  }

  componentWillUnmount() {
    this.unmounted = true;

    this.props.engine.realtime.expireOverlay(this.overlayType);
  }

  removeItem(tabID) {
    if (!this.unmounted) {
      this.setState({ items: withoutValue(this.state.items, tabID) });
    }
  }

  render() {
    const { viewersLookup } = this.props;
    const { items } = this.state;

    return items.map((tabID) => {
      const viewer = viewersLookup[tabID];

      // TODO: this is only a case because we use tabId as the lookup
      if (!viewer) return null;

      return this.renderItem(tabID, viewer, this.itemRefs[tabID]);
    });
  }
}

export default AbstractOverlay;

const mapStateToProps = {
  viewersLookup: diagramViewersLookupSelector,
};

export const connectOverlay = compose(
  connect(mapStateToProps),
  withEngine
);
