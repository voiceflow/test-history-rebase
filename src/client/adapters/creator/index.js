import { createSimpleAdapter } from '../utils';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';

const creatorAdapter = createSimpleAdapter(
  (diagram, platform) => {
    const rootNodes = [];
    const nodes = [];
    const ports = [];
    const data = {};
    const links = linkAdapter.mapFromDB(diagram.links);

    const registerNode = (node, parentNode) => {
      const nodeData = nodeDataAdapter.fromDB(node.extras, node);
      nodes.push(nodeAdapter.fromDB(node, nodeData, parentNode));

      node.ports.forEach((port) => ports.push(portAdapter.fromDB(port, nodeData.type, platform)));
      data[node.id] = nodeData;
    };

    diagram.nodes.forEach((node) => {
      rootNodes.push(node.id);

      registerNode(node);

      if (node.combines) {
        node.combines.forEach((combinedNode) => registerNode(combinedNode, node.id));
      }
    });

    return {
      diagramID: diagram.id,
      viewport: {
        x: diagram.offsetX,
        y: diagram.offsetY,
        zoom: diagram.zoom,
      },
      rootNodes,
      nodes,
      links,
      ports,
      data,
    };
  },
  () => ({})
);

export default creatorAdapter;
