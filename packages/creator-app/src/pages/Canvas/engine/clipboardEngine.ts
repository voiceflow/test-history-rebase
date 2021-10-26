import { Crypto } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { toast } from '@voiceflow/ui';
import { get, set } from 'idb-keyval';

import * as Errors from '@/config/errors';
import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import * as Models from '@/models';
import * as Clipboard from '@/utils/clipboard';
import { synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

interface ClipboardContext {
  versionID: string;
  nodes: Models.Node[];
  data: Record<string, Models.NodeData<unknown>>;
  ports: Models.Port[];
  links: Models.Link[];
  slots: Models.Slot[];
  intents: Models.Intent[];
  products: Models.Product[];
  diagrams: Models.Diagram[];
  platform: Constants.PlatformType;
}

const ClipboardVersion = {
  V3: 'v3',
  V4: 'v4',
};

const CURRENT_VERSION = ClipboardVersion.V4;

class ClipboardEngine extends EngineConsumer {
  log = this.engine.log.child('clipboard');

  internal = {
    storeData: async (
      nodeIDs: string[],
      keyToStore: string,
      keyToEncrypt: string,
      { disableSuccessToast }: { disableSuccessToast?: boolean } = {}
    ): Promise<void> => {
      const copyData = this.getClipboardContext(nodeIDs);

      // Block includes all the nodes - parent and nested
      const copiedBlocks = copyData.nodes.filter((node) => !node.parentNode);

      const encryptedData = synchronousCrypto.encrypt(JSON.stringify(copyData), keyToEncrypt);

      await set(CLIPBOARD_DATA_KEY, Crypto.Base64.encodeJSON({ key: keyToStore, data: encryptedData, version: CURRENT_VERSION }));

      if (!disableSuccessToast) {
        toast.success(`${copiedBlocks.length} block(s) copied to clipboard`);
      }
    },

    extractData: async (copiedKey: string): Promise<ClipboardContext> => {
      const b64Data = await get<string>(CLIPBOARD_DATA_KEY);

      const { data, key, version: sourceVersion } = Crypto.Base64.decodeJSON(b64Data);

      if (sourceVersion !== CURRENT_VERSION) {
        throw new Error('clipboard version mismatch');
      }

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData) as ClipboardContext;
    },

    importClipboardContext: async ({
      slots,
      intents,
      products,
      diagrams,
      nodes,
      data,
      platform: sourcePlatform,
    }: ClipboardContext): Promise<Array<{ data: Models.NodeData<unknown>; node: Models.Node }>> => {
      const state = this.engine.store.getState();
      const targetPlatform = ProjectV2.active.platformSelector(state);
      const isPlatformConversion = sourcePlatform !== targetPlatform;
      const slotTypes = VersionV2.active.slotTypesSelector(state).map((slot) => slot.value);
      const validSlots = isPlatformConversion ? slots.filter((slot) => slotTypes.includes(slot.type!)) : slots;
      const isValidSlot = validSlots.reduce<Record<string, boolean>>(
        (acc, slot) => Object.assign(acc, { [slot.id]: slotTypes.includes(slot.type!) }),
        {}
      );

      const nodesWithData = nodes.map((node) => ({ node, data: data[node.id] }));

      await Promise.all([
        this.dispatch(Slot.addManySlots(validSlots)),
        this.dispatch(
          Intent.addManyIntents(
            intents
              .filter((intent) => intent.slots.allKeys.every((key) => isValidSlot[key]))
              .map((intent) => ({ ...intent, platform: targetPlatform }))
          )
        ),
      ]);

      return this.dispatch(
        Version.importProjectContext({
          nodes: nodesWithData,
          products: targetPlatform !== Constants.PlatformType.ALEXA ? [] : products,
          diagrams,
          sourcePlatform,
          targetPlatform,
        })
      );
    },
  };

  getClipboardContext(nodeIDs: string[]): ClipboardContext {
    const state = this.engine.store.getState();
    const platform = ProjectV2.active.platformSelector(state);
    const {
      data: { ...data }, // cloning data to modify it later
    } = Creator.creatorDiagramSelector(state);

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    const allNodes = Creator.allNodesByIDsSelector(state)(nodeIDs).filter((node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND);
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

    const ports = Creator.allPortsByIDsSelector(state)(copiedNodes.flatMap((node) => [...node.ports.in, ...node.ports.out])).filter(Boolean);

    const links = copiedNodes.reduce<Models.Link[]>((acc, node) => {
      const nodeLinks = Creator.linksByNodeIDSelector(state)(node.id).filter(
        (link) => !acc.includes(link) && copiedNodeIDs.includes(link.source.nodeID) && copiedNodeIDs.includes(link.target.nodeID)
      );

      acc.push(...nodeLinks);

      return acc;
    }, []);

    const { intents: intentIDs, products: productIDs, diagrams: diagramIDs } = getCopiedNodeDataIDs(data, copiedNodes, platform);

    const products = ProductV2.productsByIDsSelector(state, { ids: productIDs });
    const diagrams = DiagramV2.diagramsByIDsSelector(state, { ids: diagramIDs });
    const intents = IntentV2.intentsByIDsSelector(state, { ids: intentIDs });
    const slotIDs = IntentV2.allSlotsIDsByIntentIDsSelector(state, { ids: intentIDs });
    const slots = SlotV2.slotsByIDsSelector(state, { ids: slotIDs });

    return {
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
  }

  async cloneClipboardContext(
    copyData: ClipboardContext,
    coords: Coords
  ): Promise<{
    nodesWithData: Models.NodeWithData[];
    ports: Models.Port[];
    links: Models.Link[];
  }> {
    const state = this.engine.store.getState();
    const versionID = Session.activeVersionIDSelector(state);

    const isSameVersion = copyData.versionID === versionID;

    const nodesWithData = isSameVersion
      ? copyData.nodes.map((node) => ({ data: copyData.data[node.id], node }))
      : await this.internal.importClipboardContext(copyData);

    const { ports, links } = copyData;

    return this.engine.diagram.cloneEntities({ nodesWithData, ports, links }, coords);
  }

  copy(nodeIDs: string[], options?: { disableSuccessToast?: boolean }): void {
    if (!nodeIDs.length) return;

    this.log.debug(this.log.pending('copying to buffer'), nodeIDs);
    const [keyToCopy, keyToStore, keyToEncrypt] = synchronousCrypto.generateEncryptedKeys();

    const serializedData = Clipboard.serialize(keyToCopy);

    Clipboard.copy(serializedData);

    // store key to ls to access it via paste option
    localStorage.setItem(CLIPBOARD_DATA_KEY, serializedData);

    // we do no need await here since copying is a background job, .encrypt called here to increase the complexity of debugging
    this.internal.storeData(nodeIDs, keyToStore, keyToEncrypt, options);

    this.log.info(this.log.success('copied to buffer'), this.log.value(nodeIDs.length));
  }

  async paste(pastedText: string, coords: Coords): Promise<void> {
    const copyBuffer = Clipboard.deserialize(pastedText);

    if (copyBuffer) {
      try {
        this.log.debug(this.log.pending('pasting to canvas'));

        const clipboardData = await this.internal.extractData(copyBuffer);

        const { nodesWithData } = await this.cloneClipboardContext(clipboardData, coords);

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
