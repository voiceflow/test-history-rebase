import { Crypto } from '@voiceflow/common';
import type { Entity, IntentWithData } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { get, set } from 'idb-keyval';
import { MD5 } from 'object-hash';

import * as Errors from '@/config/errors';
import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as CustomBlock from '@/ducks/customBlock';
import * as Designer from '@/ducks/designer';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as TrackingEvents from '@/ducks/tracking/events';
import * as VersionV2 from '@/ducks/versionV2';
import * as Clipboard from '@/utils/clipboard';
import { synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

interface ClipboardContext {
  type: Platform.Constants.ProjectType;
  data: Record<string, Realtime.NodeData<unknown>>;
  nodes: Realtime.Node[];
  ports: Realtime.Port[];
  links: Realtime.Link[];
  entities: Entity[];
  intents: IntentWithData[];
  diagrams: Realtime.Diagram[];
  platform: Platform.Constants.PlatformType;
  versionID: string;
  customBlocks: Realtime.CustomBlock[];
}

interface EncodeData {
  key: string;
  data: string;
  version: string;
}

enum ClipboardVersion {
  V3 = 'v3',
  V4 = 'v4',
}

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

    trackClipboardEvents: ({ entities = [], intents = [] }: Partial<ClipboardContext>): void => {
      entities.forEach(() => {
        this.dispatch(TrackingEvents.trackEntityCreated({ creationType: CanvasCreationType.PASTE }));
      });

      intents.forEach(() => {
        this.dispatch(TrackingEvents.trackIntentCreated({ creationType: CanvasCreationType.PASTE }));
      });
    },

    importClipboardContext: async ({
      data,
      entities,
      nodes,
      intents,
      diagrams,
      platform: sourcePlatform,
      versionID: sourceVersionID,
      customBlocks = [],
    }: ClipboardContext): Promise<Array<{ data: Realtime.NodeData<unknown>; node: Realtime.Node }>> => {
      const state = this.engine.store.getState();
      const targetPlatform = ProjectV2.active.platformSelector(state);
      const isPlatformConversion = sourcePlatform !== targetPlatform;
      const slotTypes = new Set(VersionV2.active.entityTypesSelector(state).map((slot) => slot.value));

      // ensure ids are unique
      const entityIDs = new Set(Designer.Entity.selectors.keys(state));
      const intentIDs = new Set(Designer.Intent.selectors.keys(state));
      const customBlockIDs = new Set(CustomBlock.allCustomBlockIDsSelector(state));

      const validSlots = entities.filter((entity) => {
        if (isPlatformConversion && !slotTypes.has(entity.classifier!)) return false;
        return !entityIDs.has(entity.id);
      });

      const isValidSlot = validSlots.reduce<Record<string, boolean>>(
        (acc, slot) => Object.assign(acc, { [slot.id]: slotTypes.has(slot.classifier!) }),
        {}
      );

      const nodesWithData = nodes.map((node) => ({ node, data: data[node.id] }));

      const validIntents = intents
        .filter((intent) => intent.entityOrder.every((key) => isValidSlot[key]) && !intentIDs.has(intent.id))
        .map((intent) => ({ ...intent, platform: targetPlatform }));

      const validCustomBlocks = customBlocks.filter((customBlock) => !customBlockIDs.has(customBlock.id));

      await Promise.all([
        this.dispatch(Designer.Entity.effect.createMany(validSlots)),
        this.dispatch(Designer.Intent.effect.createMany(validIntents)),
        this.dispatch(CustomBlock.addManyCustomBlocks(validCustomBlocks)),
      ]);

      this.internal.trackClipboardEvents({ intents: validIntents, entities: validSlots });

      return this.dispatch(
        VersionV2.importProjectContext({
          nodes: nodesWithData,
          diagrams,
          sourceVersionID,
        })
      );
    },
  };

  getCurrentVersion(): string {
    const schemaVersion = this.engine.select(VersionV2.active.schemaVersionSelector);

    return MD5({
      schemaVersion,
      clipboardVersion: CURRENT_VERSION,
    });
  }

  getNodesClipboardContext(nodeIDs: string[]): Pick<ClipboardContext, 'data' | 'links' | 'nodes' | 'ports'> {
    const state = this.engine.store.getState();

    // cloning data to modify it later
    const { ...data } = CreatorV2.nodeDataMapSelector(state);

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

    return {
      data,
      ports: [...ports, ...extraPorts],
      links: [...links, ...extraLinks],
      nodes: copiedNodes,
    };
  }

  getClipboardContext(nodeIDs: string[]): ClipboardContext {
    const state = this.engine.store.getState();

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    const nodesClipboard = this.getNodesClipboardContext(nodeIDs);

    const { diagramIDs, customBlockIDs } = getCopiedNodeDataIDs(nodesClipboard.data, nodesClipboard.nodes);

    return {
      ...nodesClipboard,
      type: ProjectV2.active.projectTypeSelector(state),
      intents: [],
      entities: [],
      diagrams: DiagramV2.diagramsByIDsSelector(state, { ids: diagramIDs }),
      platform: ProjectV2.active.platformSelector(state),
      versionID,
      customBlocks: CustomBlock.customBlockByIDsSelector(state, { ids: customBlockIDs }),
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
