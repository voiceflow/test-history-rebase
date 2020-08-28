import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { get, set } from 'idb-keyval';

import client from '@/client';
import nodeAdapter from '@/client/adapters/creator/node';
import nodeDataAdapter from '@/client/adapters/creator/nodeData';
import { BlockType, CLIPBOARD_DATA_KEY, COPY_NODES } from '@/constants';
import * as Creator from '@/ducks/creator';
import { addDiagrams, diagramsByIDsSelector, loadDiagramVariables } from '@/ducks/diagram';
import { displaysByIDsSelector, loadDisplaysForSkill } from '@/ducks/display';
import { addIntents, allSlotsIDsByIntentIDsSelector, intentsByIDsSelector } from '@/ducks/intent';
import { loadProductsForSkill, productsByIDsSelector } from '@/ducks/product';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { addSlots, findSlotsByIDsSelector } from '@/ducks/slot';
import { setCanvasInfo } from '@/ducks/user';
import { DBNode, Diagram, Display, Intent, Link, Node, NodeData, Port, Product, Slot } from '@/models';
import * as Clipboard from '@/utils/clipboard';
import { base64, synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer } from './utils';

type ClipboardContext = {
  skillID: string;
  nodes: Node[];
  legacyNodes: DBNode[];
  data: Record<string, NodeData<unknown>>;
  ports: Port[];
  links: Link[];
  slots: Slot[];
  intents: Intent[];
  products: Product[];
  displays: Display[];
  diagrams: Diagram[];
};

const ClipboardVersion = {
  V1: 'v1',
  V2: 'v2',
};

class ClipboardEngine extends EngineConsumer {
  log = this.engine.log.child('clipboard');

  internal = {
    storeData: async (nodeIDs: string[], keyToStore: string, keyToEncrypt: string) => {
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
        .map<Node>(({ parentNode, ...nestedNode }) => ({ ...nestedNode, parentNode: null }));
      const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => (combinedNodes.length ? Creator.allNodesByIDsSelector(state)(combinedNodes) : []));

      const copiedNodes = [...soloNodes, ...orphanedNodes, ...nestedNodes];
      const copiedNodeIDs = copiedNodes.map(({ id }) => id);

      // Block includes all the nodes - parent and nested
      const copiedBlocks = copiedNodes.filter((node) => COPY_NODES.includes(node.type));

      const ports = Creator.allPortsByIDsSelector(state)(copiedNodes.flatMap((node) => [...node.ports.in, ...node.ports.out]));

      const links = copiedNodes.reduce<Link[]>((acc, node) => {
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

      const copyData: ClipboardContext = {
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

      await set(
        CLIPBOARD_DATA_KEY,
        base64.encodeObject({
          data: encryptedData,
          key: keyToStore,
          version: ClipboardVersion.V2,
        })
      );

      this.dispatch(setCanvasInfo(`${copiedBlocks.length} block(s) copied to clipboard`));
    },

    extractData: async (copiedKey: string) => {
      const b64Data = await get<string>(CLIPBOARD_DATA_KEY);

      const { data, key, version } = JSON.parse(Utf8.stringify(Base64.parse(b64Data)));

      if (version !== ClipboardVersion.V2) {
        throw new Error('cliboard version mismatch');
      }

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData) as ClipboardContext;
    },

    importClipboardContext: async (skillID: string, { slots, intents, products, displays, diagrams, legacyNodes }: ClipboardContext) => {
      this.dispatch(addSlots(slots));
      this.dispatch(addIntents(intents));

      const { newNodes, newDiagrams } = await client.clipboard.paste(skillID, {
        nodes: legacyNodes,
        products,
        displays,
        diagrams,
      });

      this.dispatch(addDiagrams(diagrams.map((diagram) => ({ ...diagram, subDiagrams: [], id: newDiagrams[diagram.id] }))));
      await Promise.all<any>([
        this.dispatch(loadDisplaysForSkill(skillID)),
        this.dispatch(loadProductsForSkill(skillID)),
        ...diagrams.map((diagram) => this.dispatch(loadDiagramVariables(newDiagrams[diagram.id]))),
      ]);

      return newNodes;
    },
  };

  copy(unfilteredNodeIDs: string[]) {
    const nodeIDs = unfilteredNodeIDs.filter((nodeID) => COPY_NODES.includes(this.engine.getNodeByID(nodeID).type));

    if (!nodeIDs.length) return;

    this.log.debug(this.log.pending('copying to buffer'), nodeIDs);
    const [keyToCopy, keyToStore, keyToEncrypt] = synchronousCrypto.generateEncryptedKeys();

    const serializedData = Clipboard.serialize(keyToCopy);
    Clipboard.copy(serializedData);
    // store key to ls to access it via paste option
    localStorage.setItem(CLIPBOARD_DATA_KEY, serializedData);

    // we do no need await here since copying is a background job, .encrypt called here to increase the complexity of debugging
    this.internal.storeData(nodeIDs, keyToStore, keyToEncrypt);

    this.log.info(this.log.success('copied to buffer'), this.log.value(unfilteredNodeIDs.length));
  }

  async paste(pastedText: string, coords: Coords) {
    const state = this.engine.store.getState();
    const skillID = activeSkillIDSelector(state);
    const copyBuffer = Clipboard.deserialize(pastedText);

    if (copyBuffer) {
      try {
        this.log.debug(this.log.pending('pasting to canvas'));
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

        await this.engine.diagram.cloneEntities({ nodesWithData, ports, links }, coords);

        this.log.info(this.log.success('pasted to canvas'), this.log.value(nodesWithData.length));
      } catch (err) {
        localStorage.removeItem(CLIPBOARD_DATA_KEY);
        this.log.warn('error while pasting data', err);
      }
    } else {
      localStorage.removeItem(CLIPBOARD_DATA_KEY);
    }
  }
}

export default ClipboardEngine;
