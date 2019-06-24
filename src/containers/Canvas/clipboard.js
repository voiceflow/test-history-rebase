import { Toolkit } from 'components/SRD/Toolkit';
import { BlockLinkModel } from 'components/SRD/models/BlockLinkModel';
import { BlockNodeModel } from 'components/SRD/models/BlockNodeModel';

const _ = require('lodash');

const toolkit = new Toolkit();

function copy(blocks, project) {
  const nodes = blocks.filter((block) => block instanceof BlockNodeModel && block.extras.type !== 'story');
  const nodeset = new Set(nodes.map((node) => node.id));
  nodes
    .map((n) => n.combines || [])
    .flat()
    .forEach((b) => nodeset.add(b.id));
  const links = blocks.filter(
    (block) => block instanceof BlockLinkModel && nodeset.has(block.sourcePort.parent.id) && nodeset.has(block.targetPort.parent.id)
  );
  const payload = { project };
  payload.nodes = nodes.map((n) => n.serialize());
  payload.links = links.map((n) => n.serialize());

  return payload;
}

function makeNode(selected, pos, portMap, scope) {
  const node = new BlockNodeModel(selected.name, null, toolkit.UID());
  node.extras = selected.extras;

  node.x = pos.x;
  node.y = pos.y;

  Object.values(selected.ports).forEach((port) => {
    let newPort;
    port.in ? (newPort = node.addInPort(port.label)) : (newPort = node.addOutPort(port.label));
    if (port.hidden) {
      newPort.setHidden(port.hidden);
    }
    if (portMap[`${selected.id}:${port.id}`]) {
      portMap[`${selected.id}:${port.id}`][port.in ? 'setTargetPort' : 'setSourcePort'](newPort);
    }
  });

  if (selected.extras.type === 'god') {
    let totalHeight = 40;
    node.combines = selected.combines.map((combineNode) => {
      const newCombineNode = makeNode(combineNode, { x: node.x + 10, y: 0 }, portMap, scope);
      newCombineNode.parentCombine = node;
      newCombineNode.y = node.y + totalHeight;
      totalHeight += newCombineNode.height || combineNode.height;
      return newCombineNode;
    });
  }

  node.setSelected(true);
  return node;
}

function paste(payload, project, point) {
  if (payload.nodes.length === 0) return [];
  const scope = 'NEW'; // NEW, SKILL, DIAGRAM

  const centerX = (_.maxBy(payload.nodes, 'x').x + _.minBy(payload.nodes, 'x').x) / 2;
  const centerY = (_.maxBy(payload.nodes, 'y').y + _.minBy(payload.nodes, 'y').y) / 2;

  const portMap = {};
  const newLinks = payload.links.map((link) => {
    const newLink = new BlockLinkModel('default', toolkit.UID(), false);
    newLink.setSelected(true);

    portMap[`${link.source}:${link.sourcePort}`] = newLink;
    portMap[`${link.target}:${link.targetPort}`] = newLink;

    return newLink;
  });
  const newNodes = payload.nodes.map((node) => makeNode(node, { x: point.x + (node.x - centerX), y: point.y + (node.y - centerY) }, portMap, scope));

  return [...newNodes, ...newLinks];

  // same diagram => keep slots/intent/display/product/global vars/local vars/flows
  // same project => keep slots/intent/display/product/global vars/flows vars/flows, import local vars
  // else => import slots/intents/variables/diagram, reset display/product
}

export default { copy, paste };
