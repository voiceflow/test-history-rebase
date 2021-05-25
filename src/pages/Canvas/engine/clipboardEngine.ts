import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { get, set } from 'idb-keyval';

import { toast } from '@/components/Toast';
import * as Errors from '@/config/errors';
import { BlockType, CLIPBOARD_DATA_KEY, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Diagrams from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Version from '@/ducks/version';
import * as Models from '@/models';
import * as Clipboard from '@/utils/clipboard';
import { base64, synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

type ClipboardContext = {
  versionID: string;
  nodes: Models.Node[];
  data: Record<string, Models.NodeData<unknown>>;
  ports: Models.Port[];
  links: Models.Link[];
  slots: Models.Slot[];
  intents: Models.Intent[];
  products: Models.Product[];
  diagrams: Models.Diagram[];
  platform: PlatformType;
};

const ClipboardVersion = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3',
  V4: 'v4',
};

const CURRENT_VERSION = ClipboardVersion.V4;

class ClipboardEngine extends EngineConsumer {
  log = this.engine.log.child('clipboard');

  internal = {
    storeData: async (nodeIDs: string[], keyToStore: string, keyToEncrypt: string) => {
      const state = this.engine.store.getState();
      const platform = Project.activePlatformSelector(state);
      const {
        data: { ...data }, // cloning data to modify it later
      } = Creator.creatorDiagramSelector(state);

      const versionID = Session.activeVersionIDSelector(state);

      Errors.assertVersionID(versionID);

      const allNodes = Creator.allNodesByIDsSelector(state)(nodeIDs).filter(
        (node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND
      );
      const soloNodes = allNodes.filter((node) => !node.parentNode);
      const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => (combinedNodes.length ? Creator.allNodesByIDsSelector(state)(combinedNodes) : []));
      const orphanedNodes: Models.Node[] = [];

      const extraLinks: Models.Link[] = [];
      const extraPorts: Models.Port[] = [];

      allNodes
        .filter((node) => node.parentNode && !nodeIDs.includes(node.parentNode))
        .forEach(({ id, parentNode: parentNodeID, ...nestedNode }) => {
          const parentNode = this.engine.getNodeByID(parentNodeID!);

          const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [id] };

          const entities = this.engine.diagram.getParentEntities(parentNodeID!, true, nodeOverrides);

          entities.nodesWithData.forEach(({ data: nodeData }) => {
            data[nodeData.nodeID] = nodeData;
          });

          soloNodes.push(...entities.nodesWithData.map(({ node }) => node));
          extraLinks.push(...entities.links);
          extraPorts.push(...entities.ports);

          const newParentNodeID = entities.nodesWithData[0].node.id;

          orphanedNodes.push({ id, ...nestedNode, parentNode: newParentNodeID });
        });

      const copiedNodes = [...soloNodes, ...orphanedNodes, ...nestedNodes];
      const copiedNodeIDs = copiedNodes.map(({ id }) => id);

      // Block includes all the nodes - parent and nested
      const copiedBlocks = copiedNodes.filter((node) => !node.parentNode);

      const ports = Creator.allPortsByIDsSelector(state)(copiedNodes.flatMap((node) => [...node.ports.in, ...node.ports.out])).filter(Boolean);

      const links = copiedNodes.reduce<Models.Link[]>((acc, node) => {
        const nodeLinks = Creator.linksByNodeIDSelector(state)(node.id).filter(
          (link) => !acc.includes(link) && copiedNodeIDs.includes(link.source.nodeID) && copiedNodeIDs.includes(link.target.nodeID)
        );

        acc.push(...nodeLinks);

        return acc;
      }, []);

      const { intents: intentIDs, products: productIDs, diagrams: diagramIDs } = getCopiedNodeDataIDs(data, copiedNodes, platform);

      const products = Product.productsByIDsSelector(state)(productIDs);
      const diagrams = Diagrams.diagramsByIDsSelector(state)(diagramIDs);
      const intents = Intent.intentsByIDsSelector(state)(intentIDs);
      const slots = Slot.findSlotsByIDsSelector(state)(Intent.allSlotsIDsByIntentIDsSelector(state)(intentIDs));

      const copyData: ClipboardContext = {
        versionID,
        data,
        nodes: copiedNodes,
        ports: [...ports, ...extraPorts],
        links: [...links, ...extraLinks],
        products,
        diagrams,
        intents,
        slots,
        platform,
      };

      const encryptedData = synchronousCrypto.encrypt(JSON.stringify(copyData), keyToEncrypt);

      await set(
        CLIPBOARD_DATA_KEY,
        base64.encodeObject({
          data: encryptedData,
          key: keyToStore,
          version: CURRENT_VERSION,
        })
      );

      toast.success(`${copiedBlocks.length} block(s) copied to clipboard`);
    },

    extractData: async (copiedKey: string) => {
      const b64Data = await get<string>(CLIPBOARD_DATA_KEY);

      const { data, key, version: sourceVersion } = JSON.parse(Utf8.stringify(Base64.parse(b64Data)));

      if (sourceVersion !== CURRENT_VERSION) {
        throw new Error('clipboard version mismatch');
      }

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData) as ClipboardContext;
    },

    importClipboardContext: async ({ slots, intents, products, diagrams, nodes, data, platform: sourcePlatform }: ClipboardContext) => {
      const state = this.engine.store.getState();
      const targetPlatform = Project.activePlatformSelector(state);
      const isPlatformConversion = sourcePlatform !== targetPlatform;
      const slotTypes = Version.activeSlotTypesSelector(state).map((slot) => slot.value);
      const validSlots = isPlatformConversion ? slots.filter((slot) => slotTypes.includes(slot.type!)) : slots;
      const isValidSlot = validSlots.reduce<Record<string, boolean>>(
        (acc, slot) => Object.assign(acc, { [slot.id]: slotTypes.includes(slot.type!) }),
        {}
      );

      this.dispatch(Slot.addSlots(slots.filter((slot) => slotTypes.includes(slot.type!))));
      this.dispatch(
        Intent.addIntents(
          intents.filter((intent) => intent.slots.allKeys.every((key) => isValidSlot[key])).map((intent) => ({ ...intent, platform: targetPlatform }))
        )
      );

      const nodesWithData = nodes.map((node) => ({ node, data: data[node.id] }));

      return this.dispatch(
        Version.importProjectContext({
          nodes: nodesWithData,
          products: targetPlatform !== PlatformType.ALEXA ? [] : products,
          diagrams,
          sourcePlatform,
          targetPlatform,
        })
      );
    },
  };

  copy(nodeIDs: string[]) {
    if (!nodeIDs.length) return;

    this.log.debug(this.log.pending('copying to buffer'), nodeIDs);
    const [keyToCopy, keyToStore, keyToEncrypt] = synchronousCrypto.generateEncryptedKeys();

    const serializedData = Clipboard.serialize(keyToCopy);
    Clipboard.copy(serializedData);
    // store key to ls to access it via paste option
    localStorage.setItem(CLIPBOARD_DATA_KEY, serializedData);

    // we do no need await here since copying is a background job, .encrypt called here to increase the complexity of debugging
    this.internal.storeData(nodeIDs, keyToStore, keyToEncrypt);

    this.log.info(this.log.success('copied to buffer'), this.log.value(nodeIDs.length));
  }

  async paste(pastedText: string, coords: Coords) {
    const state = this.engine.store.getState();
    const versionID = Session.activeVersionIDSelector(state);
    const copyBuffer = Clipboard.deserialize(pastedText);

    if (copyBuffer) {
      try {
        this.log.debug(this.log.pending('pasting to canvas'));

        const result = await this.internal.extractData(copyBuffer);

        const isSameVersion = result.versionID === versionID;

        const nodesWithData = isSameVersion
          ? result.nodes.map((node) => {
              const data = result.data[node.id];

              return {
                data,
                node,
              };
            })
          : await this.internal.importClipboardContext(result);

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
