import { Crypto } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { get, set } from 'idb-keyval';
import { MD5 } from 'object-hash';

import * as Errors from '@/config/errors';
import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as TrackingEvents from '@/ducks/tracking/events';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import * as Clipboard from '@/utils/clipboard';
import { synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

interface ClipboardContext {
  versionID: string;
  nodes: Realtime.Node[];
  data: Record<string, Realtime.NodeData<unknown>>;
  ports: Realtime.Port[];
  links: Realtime.Link[];
  slots: Realtime.Slot[];
  intents: Platform.Base.Models.Intent.Model[];
  products: Realtime.Product[];
  diagrams: Realtime.Diagram[];
  platform: Platform.Constants.PlatformType;
  type: Platform.Constants.ProjectType;
}

interface EncodeData {
  key: string;
  data: string;
  version: string;
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

      const encodeData: EncodeData = {
        key: keyToStore,
        data: encryptedData,
        version: this.getCurrentVersion(),
      };

      await set(CLIPBOARD_DATA_KEY, Crypto.Base64.encodeJSON(encodeData));

      if (!disableSuccessToast) {
        toast.success(`${copiedBlocks.length} block(s) copied to clipboard`);
      }
    },

    extractData: async (copiedKey: string): Promise<ClipboardContext> => {
      const b64Data = await get<string>(CLIPBOARD_DATA_KEY);

      const { data, key, version: sourceVersion } = Crypto.Base64.decodeJSON<EncodeData>(b64Data);

      if (sourceVersion !== this.getCurrentVersion()) {
        throw new Error('clipboard version mismatch');
      }

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData) as ClipboardContext;
    },

    trackClipboardEvents: ({ intents, slots }: Partial<ClipboardContext>): void => {
      slots?.forEach(() => {
        this.dispatch(TrackingEvents.trackEntityCreated({ creationType: CanvasCreationType.PASTE }));
      });

      intents?.forEach(({ inputs, id }) => {
        this.dispatch(TrackingEvents.trackIntentCreated({ creationType: CanvasCreationType.PASTE }));

        if (!inputs?.length) {
          return;
        }

        inputs.forEach(() => {
          this.dispatch(
            TrackingEvents.trackNewUtteranceCreated({
              intentID: id,
              creationType: CanvasCreationType.PASTE,
            })
          );
        });
      });
    },

    importClipboardContext: async ({
      slots,
      intents,
      products,
      diagrams,
      nodes,
      data,
      platform: sourcePlatform,
    }: ClipboardContext): Promise<Array<{ data: Realtime.NodeData<unknown>; node: Realtime.Node }>> => {
      const state = this.engine.store.getState();
      const targetPlatform = ProjectV2.active.platformSelector(state);
      const isPlatformConversion = sourcePlatform !== targetPlatform;
      const slotTypes = new Set(VersionV2.active.slotTypesSelector(state).map((slot) => slot.value));

      // ensure ids are unique
      const slotIDs = new Set(SlotV2.allSlotIDsSelector(state));
      const intentIDs = new Set(IntentV2.allIntentIDsSelector(state));

      const validSlots = slots.filter((slot) => {
        if (isPlatformConversion && !slotTypes.has(slot.type!)) return false;
        return !slotIDs.has(slot.id);
      });

      const isValidSlot = validSlots.reduce<Record<string, boolean>>((acc, slot) => Object.assign(acc, { [slot.id]: slotTypes.has(slot.type!) }), {});

      const nodesWithData = nodes.map((node) => ({ node, data: data[node.id] }));

      const validIntents = intents
        .filter((intent) => intent.slots.allKeys.every((key) => isValidSlot[key]) && !intentIDs.has(intent.id))
        .map((intent) => ({ ...intent, platform: targetPlatform }));

      await Promise.all([this.dispatch(Slot.addManySlots(validSlots)), this.dispatch(Intent.addManyIntents(validIntents, CanvasCreationType.PASTE))]);

      this.internal.trackClipboardEvents({ intents: validIntents, slots: validSlots });

      return this.dispatch(
        Version.importProjectContext({
          nodes: nodesWithData,
          products: targetPlatform !== Platform.Constants.PlatformType.ALEXA ? [] : products,
          diagrams,
          sourcePlatform,
          targetPlatform,
        })
      );
    },
  };

  getCurrentVersion(): string {
    const schemaVersion = this.engine.select(VersionV2.active.schemaVersionSelector);

    return MD5({
      clipboardVersion: CURRENT_VERSION,
      schemaVersion,
    });
  }

  getClipboardContext(nodeIDs: string[]): ClipboardContext {
    const state = this.engine.store.getState();
    const platform = ProjectV2.active.platformSelector(state);
    const type = ProjectV2.active.projectTypeSelector(state);

    // cloning data to modify it later
    const { ...data } = CreatorV2.nodeDataMapSelector(state);

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    const allNodes = CreatorV2.nodesByIDsSelector(state, { ids: nodeIDs }).filter(
      (node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND
    );
    const soloNodes = allNodes.filter((node) => !node.parentNode);
    const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => CreatorV2.nodesByIDsSelector(state, { ids: combinedNodes }));
    const orphanedNodes: Realtime.Node[] = [];

    const extraLinks: Realtime.Link[] = [];
    const extraPorts: Realtime.Port[] = [];

    allNodes
      .filter((node) => node.parentNode && !nodeIDs.includes(node.parentNode))
      .forEach(({ id, type, parentNode: parentNodeID, ...nestedNode }) => {
        const parentNode = this.engine.getNodeByID(parentNodeID)!;

        const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [id] };

        const entities = this.engine.diagram.getParentEntities(parentNodeID!, type !== BlockType.INTENT, nodeOverrides);

        entities.nodesWithData.forEach(({ data: nodeData }) => {
          data[nodeData.nodeID] = nodeData;
        });

        soloNodes.push(...entities.nodesWithData.map(({ node }) => node));
        extraLinks.push(...entities.links);
        extraPorts.push(...entities.ports);

        const newParentNodeID = entities.nodesWithData[0].node.id;

        orphanedNodes.push({ id, type, ...nestedNode, parentNode: newParentNodeID });
      });

    const copiedNodes = [...soloNodes, ...orphanedNodes, ...nestedNodes];
    const copiedNodeIDMap = copiedNodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});

    const ports = CreatorV2.allPortsByIDsSelector(state, {
      ids: copiedNodes.flatMap((node) => Realtime.Utils.port.flattenAllPorts(node.ports)),
    }).filter(Boolean);

    const links = copiedNodes.reduce<Realtime.Link[]>((acc, node) => {
      const nodeLinks = CreatorV2.linksByNodeIDSelector(state, { id: node.id }).filter(
        (link) => !acc.includes(link) && copiedNodeIDMap[link.source.nodeID] && copiedNodeIDMap[link.target.nodeID]
      );

      acc.push(...nodeLinks);

      return acc;
    }, []);

    const { intents: intentIDs, products: productIDs, diagrams: diagramIDs } = getCopiedNodeDataIDs(data, copiedNodes);

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
      type,
    };
  }

  async cloneClipboardContext(
    copyData: ClipboardContext,
    coords: Coords
  ): Promise<{
    nodesWithData: Realtime.NodeWithData[];
    ports: Realtime.Port[];
    links: Realtime.Link[];
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
    const copyBuffer = Clipboard.deserialize<string>(pastedText);

    if (copyBuffer) {
      try {
        this.log.debug(this.log.pending('pasting to canvas'));

        const clipboardData = await this.internal.extractData(copyBuffer);

        const state = this.engine.store.getState();
        const projectType = ProjectV2.active.projectTypeSelector(state);

        if (clipboardData.type && projectType !== clipboardData.type) {
          toast.error(`Cannot paste from a ${clipboardData.type} project to a ${projectType} project.`);
          return;
        }

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
