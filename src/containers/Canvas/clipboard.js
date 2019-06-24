import { Toolkit } from 'components/SRD/Toolkit';
import { BlockLinkModel } from 'components/SRD/models/BlockLinkModel';
import { BlockNodeModel } from 'components/SRD/models/BlockNodeModel';

const _ = require('lodash');

const toolkit = new Toolkit();
// todo optimize
function lookup(arr, id) {
  return arr.filter((i) => i.key === id)[0];
}

function copy(blocks, skill) {
  const nodes = blocks.filter((block) => block instanceof BlockNodeModel && block.extras.type !== 'story');
  let intents = [];
  nodes
    .filter((block) => block.extras.google || block.extras.alexa)
    .map((block) => block.extras)
    .forEach((data) => {
      intents.push(data.alexa.intent || data.alexa.choices.map((choice) => choice.intent));
      intents.push(data.google.intent || data.google.choices.map((choice) => choice.intent));
    });
  intents = _.uniqBy(intents.flat().filter((intent) => intent), 'key').map((intent) => lookup(skill.intents, intent.key));
  const slots = intents
    .map((intent) => intent.inputs)
    .flat()
    .map((input) => input.slots)
    .flat()
    .map((id) => lookup(skill.slots, id));

  const nodeset = new Set(nodes.map((node) => node.id));
  nodes
    .map((n) => n.combines || [])
    .flat()
    .forEach((b) => nodeset.add(b.id));
  const links = blocks.filter(
    (block) => block instanceof BlockLinkModel && nodeset.has(block.sourcePort.parent.id) && nodeset.has(block.targetPort.parent.id)
  );
  return {
    skill: skill.skill_id,
    nodes: nodes.map((n) => n.serialize()),
    links: links.map((n) => n.serialize()),
    slots,
    intents,
  };
}

function makeNode(selected, pos, portMap, scope) {
  const node = new BlockNodeModel(selected.name, null, toolkit.UID());
  node.extras = selected.extras;

  if (scope === 'NEW') {
    if (node.extras.display_id) node.extras.display_id = null;
    if (node.extras.product_id) node.extras.product_id = null;
    if (node.extras.diagram_id) node.extras.diagram_id = '';
  }

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

function paste(payload, skill, point) {
  if (payload.nodes.length === 0) return [];
  const scope = payload.skill === skill.skill_id ? 'SKILL' : 'NEW';

  payload.slots.forEach((slot) => {
    if (!lookup(skill.slots, slot.key)) skill.slots.push(slot);
  });

  payload.intents.forEach((intent) => {
    if (!lookup(skill.intents, intent.key)) skill.intents.push(intent);
  });

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

  // same project => keep slots/intent/display/product/flows
  // else => import slots/intents/diagram, reset display/product
}

export default { copy, paste };
