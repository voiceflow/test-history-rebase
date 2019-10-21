import client from '@/client';
import nodeAdapter from '@/client/adapters/creator/node';
import nodeDataAdapter from '@/client/adapters/creator/nodeData';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { addDiagrams, diagramsByIDsSelector } from '@/ducks/diagram';
import { displaysByIDsSelector, loadDisplaysForSkill } from '@/ducks/display';
import { addIntents, allSlotsIDsByIntentIDsSelector, intentsByIDsSelector } from '@/ducks/intent';
import { loadProductsForSkill, productsByIDsSelector } from '@/ducks/product';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { addSlots, findSlotsByIDsSelector } from '@/ducks/slot';
import { setCanvasInfo } from '@/ducks/user';
import { loadVariableSetForDiagram } from '@/ducks/variableSet';
import * as Clipboard from '@/utils/clipboard';

import { EngineConsumer } from './utils';

class ClipboardEngine extends EngineConsumer {
  async copy(nodeIDs) {
    const state = this.engine.store.getState();
    const creator = Creator.creatorStateSelector(state);
    const platform = activePlatformSelector(state);

    const skillID = activeSkillIDSelector(state);

    const allNodes = Creator.allNodesByIDsSelector(state)(nodeIDs).filter((node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND);
    const soloNodes = allNodes.filter((node) => !node.parentNode);
    const orphanedNodes = allNodes
      .filter((node) => node.parentNode && !nodeIDs.includes(node.parentNode))
      .map(({ parentNode, ...nestedNode }) => nestedNode);
    const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => (combinedNodes.length ? Creator.allNodesByIDsSelector(state)(combinedNodes) : []));

    const copiedNodes = [...soloNodes, ...orphanedNodes, ...nestedNodes];
    const copiedNodeIDs = copiedNodes.map(({ id }) => id);

    const ports = Creator.allPortsByIDsSelector(state)(copiedNodes.flatMap((node) => [...node.ports.in, ...node.ports.out]));

    const links = copiedNodes.reduce((acc, node) => {
      const nodeLinks = Creator.linksByNodeIDSelector(state)(node.id).filter(
        (link) => !acc.includes(link) && copiedNodeIDs.includes(link.source.nodeID) && copiedNodeIDs.includes(link.target.nodeID)
      );
      acc.push(...nodeLinks);

      return acc;
    }, []);

    const legacyNodes = copiedNodes.map((node) =>
      nodeAdapter.toDB(node, { nodes: creator.nodes, ports: creator.ports, data: creator.data, linksByPortID: creator.linksByPortID, platform })
    );
    const { intents: intentIDs, displays: displayIDs, products: productIDs, diagrams: diagramIDs } = await client.clipboard.copy(
      skillID,
      legacyNodes
    );

    const displays = displaysByIDsSelector(state)(displayIDs);
    const products = productsByIDsSelector(state)(productIDs.map(String));
    const diagrams = diagramsByIDsSelector(state)(diagramIDs);
    const intents = intentsByIDsSelector(state)(intentIDs);
    const slots = findSlotsByIDsSelector(state)(allSlotsIDsByIntentIDsSelector(state)(intentIDs));

    const copyBuffer = {
      skillID,
      data: creator.data,
      nodes: copiedNodes,
      legacyNodes,
      ports,
      links,
      displays,
      products,
      diagrams,
      intents,
      slots,
    };

    Clipboard.copy(Clipboard.serialize(copyBuffer));

    this.dispatch(setCanvasInfo(`${copiedNodes.length} block(s) copied to clipboard`));
  }

  async importClipboardContext(skillID, { slots, intents, products, displays, diagrams, legacyNodes }) {
    this.dispatch(addSlots(slots));
    this.dispatch(addIntents(intents));

    const { newNodes, newDiagrams } = await client.clipboard.paste(skillID, {
      nodes: legacyNodes,
      products,
      displays,
      diagrams,
    });

    this.dispatch(addDiagrams(diagrams.map((diagram) => ({ ...diagram, subDiagrams: [], id: newDiagrams[diagram.id] }))));
    await Promise.all([
      this.dispatch(loadDisplaysForSkill(skillID)),
      this.dispatch(loadProductsForSkill(skillID)),
      ...diagrams.map((diagram) => this.dispatch(loadVariableSetForDiagram(newDiagrams[diagram.id]))),
    ]);

    return newNodes;
  }

  async paste(pastedText, mousePosition) {
    const state = this.engine.store.getState();
    const skillID = activeSkillIDSelector(state);
    const result = Clipboard.deserialize(pastedText);

    if (result) {
      const isSameSkill = result.skillID === skillID;

      const legacyNodes = isSameSkill ? result.legacyNodes : await this.importClipboardContext(skillID, result);

      const nodesWithData = legacyNodes.map((node) => {
        const nodeData = nodeDataAdapter.fromDB(node.extras, node);

        return {
          data: nodeData,
          node: nodeAdapter.fromDB(node, nodeData, node.parentNode),
        };
      });

      const { ports, links } = result;

      this.engine.node.clone({ nodesWithData, ports, links }, mousePosition);
    }
  }
}

export default ClipboardEngine;
