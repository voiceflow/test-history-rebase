import { withoutValue } from '@/utils/array';

class Dispatcher {
  /* eslint-disable compat/compat */
  nodeConnectors = new Map();
  /* eslint-enable compat/compat */

  connectNode(nodeID, redraw) {
    this.nodeConnectors.set(nodeID, [...(this.nodeConnectors.get(nodeID) || []), redraw]);
  }

  disconnectNode(nodeID, redraw) {
    this.nodeConnectors.set(nodeID, withoutValue(this.nodeConnectors.get(nodeID) || [], redraw));
  }

  redrawNode = (nodeID) => {
    const listeners = this.nodeConnectors.get(nodeID);

    if (listeners) {
      listeners.forEach((redraw) => redraw());
    }
  };
}

export default Dispatcher;
