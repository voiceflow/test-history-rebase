import axios from 'axios';
import { Toolkit } from 'components/SRD/Toolkit';
import { BlockLinkModel } from 'components/SRD/models/BlockLinkModel';
import { BlockNodeModel } from 'components/SRD/models/BlockNodeModel';
import { fetchDisplays } from 'ducks/display';
import { fetchProducts } from 'ducks/product';
import { setCanvasInfo } from 'ducks/user';
import { updateIntents } from 'ducks/version';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import React from 'react';
import { connect } from 'react-redux';

const toolkit = new Toolkit();

function makeNode(selected, pos, portMap) {
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
      const newCombineNode = makeNode(combineNode, { x: node.x + 10, y: 0 }, portMap);
      newCombineNode.parentCombine = node;
      newCombineNode.y = node.y + totalHeight;
      totalHeight += newCombineNode.height || combineNode.height;
      return newCombineNode;
    });
  }

  node.setSelected(true);
  return node;
}

class Clipboard extends React.Component {
  componentDidMount() {
    Mousetrap.bind(['ctrl+c', 'command+c'], () => this.copy());
    Mousetrap.bind(['ctrl+v', 'command+v'], () => this.paste());
  }

  async copy(singleBlock) {
    const blocks = singleBlock || this.props.engine.getDiagramModel().getSelectedItems();
    const nodes = blocks.filter((block) => block instanceof BlockNodeModel && block.extras.type !== 'story');

    const flatNodes = nodes.map((n) => (_.isEmpty(n.combines) ? n : n.combines)).flat();
    const nodeset = new Set(flatNodes.map((node) => node.id));

    const links = blocks.filter(
      (block) => block instanceof BlockLinkModel && nodeset.has(block.sourcePort.parent.id) && nodeset.has(block.targetPort.parent.id)
    );

    const { dintents, dslots, ddisplays, dproducts, ddiagrams } = this.props;

    let { intents, displays, products, diagrams } = (await axios.post(
      `/skill/${this.props.skill.skill_id}/clipboard/copy`,
      flatNodes.map((n) => n.serialize())
    )).data;

    intents = intents.map((k) => dintents[k]).filter((v) => v);
    displays = displays.map((k) => ddisplays[k]);
    products = products.map((k) => dproducts[k]);
    diagrams = diagrams.map((k) => ddiagrams[k]);

    const slots = _.uniq(
      intents
        .filter((intent) => intent)
        .map((intent) => intent.inputs)
        .flat()
        .map((input) => input.slots)
        .flat()
    ).map((id) => dslots[id]);

    const payload = {
      skill: this.props.skill.skill_id,
      nodes: nodes.map((n) => n.serialize()),
      links: links.map((n) => n.serialize()),
      slots,
      intents,
      displays,
      products,
      diagrams,
    };
    localStorage.clipboard = JSON.stringify(payload);
    this.props.setCanvasInfo(`${nodes.length} block(s) copied to clipboard`);
  }

  async importExtra(payload) {
    const { skill, dintents, dslots } = this.props;
    const { slots, intents, products, displays, diagrams, nodes } = payload;

    slots.forEach((slot) => {
      if (!dslots[slot.key]) skill.slots.push(slot);
    });

    intents.forEach((intent) => {
      if (!dintents[intent.key]) skill.intents.push(intent);
    });

    this.props.updateIntents();

    const { newNodes, newDiagrams } = (await axios.post(`/skill/${skill.skill_id}/clipboard/paste`, {
      nodes,
      products,
      displays,
      diagrams,
    })).data;
    this.props.fetchProducts(skill.skill_id);
    this.props.fetchDisplays(skill.skill_id);
    this.props.addDiagrams(diagrams.map((diagram) => ({ ...diagram, sub_diagrams: [], id: newDiagrams[diagram.id] })));
    return newNodes;
  }

  async paste() {
    const { engine, skill } = this.props;
    const point = engine.getRelativeMousePoint(this.props.getEvent());
    engine.stopMove();
    engine.getDiagramModel().clearSelection();
    if (!localStorage.clipboard || JSON.parse(localStorage.clipboard).nodes.length === 0) return;

    const payload = JSON.parse(localStorage.clipboard);
    const { skill: source, links } = payload;
    const scope = source === skill.skill_id ? 'SKILL' : 'NEW';
    const nodes = scope === 'NEW' ? await this.importExtra(payload) : payload.nodes;

    const centerX = (_.maxBy(nodes, 'x').x + _.minBy(nodes, 'x').x) / 2;
    const centerY = (_.maxBy(nodes, 'y').y + _.minBy(nodes, 'y').y) / 2;

    const portMap = {};
    const newLinks = links.map((link) => {
      const newLink = new BlockLinkModel('default', toolkit.UID(), false);
      newLink.setSelected(true);

      portMap[`${link.source}:${link.sourcePort}`] = newLink;
      portMap[`${link.target}:${link.targetPort}`] = newLink;

      return newLink;
    });
    const newNodes = nodes.map((node) => makeNode(node, { x: point.x + (node.x - centerX), y: point.y + (node.y - centerY) }, portMap));

    const newObjs = [...newNodes, ...newLinks];

    engine.getDiagramModel().addAll(...newObjs);
    this.props.onPaste(newObjs, engine);
  }

  // eslint-disable-next-line lodash/prefer-constant
  render() {
    return null;
  }
}

const arrToDict = (arr, key) =>
  arr.reduce((dict, i) => {
    dict[i[key]] = i;
    return dict;
  }, {});

const mapStateToProps = (state) => {
  return {
    skill: state.skills.skill,
    dintents: arrToDict(state.skills.skill.intents, 'key'),
    dslots: arrToDict(state.skills.skill.slots, 'key'),
    ddisplays: arrToDict(state.displays.displays, 'display_id'),
    dproducts: arrToDict(state.products.products, 'id'),
    ddiagrams: arrToDict(state.diagrams.diagrams, 'id'),
  };
};

export default connect(
  mapStateToProps,
  { updateIntents, fetchProducts, fetchDisplays, setCanvasInfo },
  null,
  { forwardRef: true }
)(Clipboard);
