/* eslint-disable react/display-name */

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { EngineContext } from './EngineContext';

export const NodeIDContext = React.createContext(null);
export const { Provider: NodeIDProvider, Consumer: NodeIDConsumer } = NodeIDContext;

const computeProps = (engine, nodeID) => ({
  node: engine.getNodeByID(nodeID),
  data: engine.getDataByNodeID(nodeID),
});

export const useNode = () => {
  const nodeID = React.useContext(NodeIDContext);
  const engine = React.useContext(EngineContext);
  const [state, setState] = React.useState(computeProps(engine, nodeID));

  React.useEffect(() => {
    const redraw = () => setState(computeProps(engine, nodeID));

    engine.dispatcher.connectNode(nodeID, redraw);

    return () => engine.dispatcher.disconnectNode(nodeID, redraw);
  }, []);

  return state;
};

export const withNode = (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withNode'))(
    React.forwardRef((props, ref) => {
      const state = useNode();

      return <Component {...state} {...props} ref={ref}></Component>;
    })
  );
