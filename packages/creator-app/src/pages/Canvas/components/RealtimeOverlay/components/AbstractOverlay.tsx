import React from 'react';

import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { DBMember } from '@/models';
import { OverlayType } from '@/pages/Canvas/constants';
import { InjectedEngineProps, withEngine } from '@/pages/Canvas/contexts';
import { RealtimeCursorOverlayAPI, RealtimeLinkOverlayAPI } from '@/pages/Canvas/types';
import { ConnectedProps, HOC } from '@/types';
import { append, withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';

export interface RealtimeOverlayState {
  items: string[];
}

export type RealtimeViewer = DBMember & { color: string };

abstract class AbstractOverlay<
  T extends RealtimeCursorOverlayAPI | RealtimeLinkOverlayAPI
> extends React.PureComponent<ConnectedRealtimeOverlayProps> {
  state: RealtimeOverlayState = {
    items: [],
  };

  itemRefs: Record<string, React.RefObject<HTMLElement | SVGElement>> = {};

  unmounted = false;

  constructor(protected overlayType: OverlayType, props: ConnectedRealtimeOverlayProps) {
    super(props);
  }

  getElement(tabID: string) {
    return this.itemRefs[tabID]?.current;
  }

  animateElement(tabID: string, animate: (element: HTMLElement | SVGElement) => void) {
    if (this.state.items.includes(tabID)) {
      const itemEl = this.getElement(tabID)!;

      window.requestAnimationFrame(() => animate(itemEl));
    } else if (!this.unmounted) {
      this.itemRefs[tabID] = React.createRef();
      this.setState({ items: append(this.state.items, tabID) });
    }
  }

  componentDidMount() {
    this.props.engine.realtime.register(this.overlayType, this.api);
  }

  componentWillUnmount() {
    this.unmounted = true;

    this.props.engine.realtime.register(this.overlayType, null);
  }

  removeItem(tabID: string) {
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

  abstract api: T;

  abstract renderItem(tabID: string, viewer: RealtimeViewer, ref: React.RefObject<Element>): React.ReactNode;
}

export default AbstractOverlay;

const mapStateToProps = {
  viewersLookup: Realtime.diagramViewersLookupSelector,
};

export const connectOverlay = compose(connect(mapStateToProps), withEngine) as HOC<ConnectedRealtimeOverlayProps, {}>;

export type ConnectedRealtimeOverlayProps = ConnectedProps<typeof mapStateToProps> & InjectedEngineProps;
