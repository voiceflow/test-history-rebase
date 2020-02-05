import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { get, set } from 'idb-keyval';

import client from '@/client';
import nodeAdapter from '@/client/adapters/creator/node';
import nodeDataAdapter from '@/client/adapters/creator/nodeData';
import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
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
import { base64, synchronous as synchronousCrypto } from '@/utils/crypto';

import { EngineConsumer } from './utils';

class ClipboardEngine extends EngineConsumer {
  internal = {
    storeData: async (nodeIDs, keyToStore, keyToEncrypt) => {
      const state = this.engine.store.getState();
      const creator = Creator.creatorDiagramSelector(state);
      const platform = activePlatformSelector(state);

      const skillID = activeSkillIDSelector(state);

      const allNodes = Creator.allNodesByIDsSelector(state)(nodeIDs).filter(
        (node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND
      );
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

      const copyData = {
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

      const encryptedData = synchronousCrypto.encrypt(JSON.stringify(copyData), keyToEncrypt);

      await set(CLIPBOARD_DATA_KEY, base64.encodeObject({ data: encryptedData, key: keyToStore }));

      this.dispatch(setCanvasInfo(`${copiedNodes.length} block(s) copied to clipboard`));
    },

    extractData: async (copiedKey) => {
      const b64Data = await get(CLIPBOARD_DATA_KEY);

      const { data, key } = JSON.parse(Utf8.stringify(Base64.parse(b64Data)));

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData);
    },

    importClipboardContext: async (skillID, { slots, intents, products, displays, diagrams, legacyNodes }) => {
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
    },
  };

  copy(nodeIDs) {
    const [keyToCopy, keyToStore, keyToEncrypt] = synchronousCrypto.generateEncryptedKeys();

    const serializedData = Clipboard.serialize(keyToCopy);
    Clipboard.copy(serializedData);
    // store key to ls to access it via paste option
    localStorage.setItem(CLIPBOARD_DATA_KEY, serializedData);

    // we do no need await here since copying is a background job, .encrypt called here to increase the complexity of debugging
    this.internal.storeData(nodeIDs, keyToStore, keyToEncrypt);
  }

  async paste(pastedText, mousePosition) {
    const state = this.engine.store.getState();
    const skillID = activeSkillIDSelector(state);
    const copyBuffer = Clipboard.deserialize(pastedText);

    if (copyBuffer) {
      try {
        const result = await this.internal.extractData(copyBuffer);

        const isSameSkill = result.skillID === skillID;

        const legacyNodes = isSameSkill ? result.legacyNodes : await this.internal.importClipboardContext(skillID, result);

        const nodesWithData = legacyNodes.map((node) => {
          const nodeData = nodeDataAdapter.fromDB(node.extras, node);

          return {
            data: nodeData,
            node: nodeAdapter.fromDB(node, nodeData, node.parentNode),
          };
        });

        const { ports, links } = result;

        await this.engine.diagram.cloneEntities({ nodesWithData, ports, links }, mousePosition);
      } catch (err) {
        localStorage.clear(CLIPBOARD_DATA_KEY);
        // eslint-disable-next-line no-console
        console.warn('error while pasting data:', err);
      }
    } else {
      localStorage.clear(CLIPBOARD_DATA_KEY);
    }
  }
}

export default ClipboardEngine;
