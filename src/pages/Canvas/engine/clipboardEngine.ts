import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { get, set } from 'idb-keyval';

import client from '@/client';
import nodeAdapter from '@/client/adapters/creator/node';
import nodeDataAdapter from '@/client/adapters/creator/nodeData';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { BlockType, CLIPBOARD_DATA_KEY, COPY_NODES, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Diagrams from '@/ducks/diagram';
import * as Display from '@/ducks/display';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Skill from '@/ducks/skill';
import { handlePastedNodes } from '@/ducks/skill/sideEffectsV2';
import * as Slot from '@/ducks/slot';
import * as Models from '@/models';
import { activeSlotTypesSelector } from '@/store/selectors';
import * as Clipboard from '@/utils/clipboard';
import { base64, synchronous as synchronousCrypto } from '@/utils/crypto';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

type ClipboardContext = {
  skillID: string;
  nodes: Models.Node[];
  legacyNodes: Models.DBNode[];
  data: Record<string, Models.NodeData<unknown>>;
  ports: Models.Port[];
  links: Models.Link[];
  slots: Models.Slot[];
  intents: Models.Intent[];
  products: Models.Product[];
  // TODO: remove when DATA_REFACTOR feature flag is removed
  displays: Models.Display[];
  diagrams: Models.Diagram[];
  platform: PlatformType;
};

const ClipboardVersion = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3',
};

class ClipboardEngine extends EngineConsumer {
  log = this.engine.log.child('clipboard');

  internal = {
    storeData: async (nodeIDs: string[], keyToStore: string, keyToEncrypt: string) => {
      const state = this.engine.store.getState();
      const creator = Creator.creatorDiagramSelector(state);
      const platform = Skill.activePlatformSelector(state);
      const { data } = Creator.creatorDiagramSelector(state);

      const isDataRefactorEnabled = this.engine.isFeatureEnabled(FeatureFlag.DATA_REFACTOR);

      const skillID = Skill.activeSkillIDSelector(state);

      const allNodes = Creator.allNodesByIDsSelector(state)(nodeIDs).filter(
        (node) => node.type !== BlockType.START && node.type !== BlockType.COMMAND
      );
      const soloNodes = allNodes.filter((node) => !node.parentNode);
      const orphanedNodes = allNodes
        .filter((node) => node.parentNode && !nodeIDs.includes(node.parentNode))
        .map<Models.Node>(({ parentNode, ...nestedNode }) => ({ ...nestedNode, parentNode: null }));
      const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => (combinedNodes.length ? Creator.allNodesByIDsSelector(state)(combinedNodes) : []));

      const copiedNodes = [...soloNodes, ...orphanedNodes, ...nestedNodes];
      const copiedNodeIDs = copiedNodes.map(({ id }) => id);

      // Block includes all the nodes - parent and nested
      const copiedBlocks = copiedNodes.filter((node) => COPY_NODES.includes(node.type));

      const ports = Creator.allPortsByIDsSelector(state)(copiedNodes.flatMap((node) => [...node.ports.in, ...node.ports.out]));

      const links = copiedNodes.reduce<Models.Link[]>((acc, node) => {
        const nodeLinks = Creator.linksByNodeIDSelector(state)(node.id).filter(
          (link) => !acc.includes(link) && copiedNodeIDs.includes(link.source.nodeID) && copiedNodeIDs.includes(link.target.nodeID)
        );
        acc.push(...nodeLinks);

        return acc;
      }, []);

      const legacyNodes = copiedNodes.map((node) =>
        nodeAdapter.toDB(node, { nodes: creator.nodes, ports: creator.ports, data: creator.data, linksByPortID: creator.linksByPortID, platform })
      );
      let copyData: ClipboardContext;

      if (isDataRefactorEnabled) {
        const { intents: intentIDs, products: productIDs, diagrams: diagramIDs } = getCopiedNodeDataIDs(data, copiedNodes, platform);

        const products = Product.productsByIDsSelector(state)(productIDs);
        const diagrams = Diagrams.diagramsByIDsSelector(state)(diagramIDs);
        const intents = Intent.intentsByIDsSelector(state)(intentIDs);
        const slots = Slot.findSlotsByIDsSelector(state)(Intent.allSlotsIDsByIntentIDsSelector(state)(intentIDs));

        copyData = {
          skillID,
          data: creator.data,
          nodes: copiedNodes,
          legacyNodes,
          ports,
          links,
          displays: [],
          products,
          diagrams,
          intents,
          slots,
          platform,
        };
      } else {
        const { intents: intentIDs, products: productIDs, displays: displayIDs, diagrams: diagramIDs } = await client.clipboard.copy(
          skillID,
          legacyNodes
        );

        const displays = Display.displaysByIDsSelector(state)(displayIDs);
        const products = Product.productsByIDsSelector(state)(productIDs.map(String));
        const diagrams = Diagrams.diagramsByIDsSelector(state)(diagramIDs);
        const intents = Intent.intentsByIDsSelector(state)(intentIDs);
        const slots = Slot.findSlotsByIDsSelector(state)(Intent.allSlotsIDsByIntentIDsSelector(state)(intentIDs));

        copyData = {
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
          platform,
        };
      }

      const encryptedData = synchronousCrypto.encrypt(JSON.stringify(copyData), keyToEncrypt);
      const version = isDataRefactorEnabled ? ClipboardVersion.V3 : ClipboardVersion.V2;

      await set(
        CLIPBOARD_DATA_KEY,
        base64.encodeObject({
          data: encryptedData,
          key: keyToStore,
          version,
        })
      );

      toast.success(`${copiedBlocks.length} block(s) copied to clipboard`);
    },

    extractData: async (copiedKey: string) => {
      const b64Data = await get<string>(CLIPBOARD_DATA_KEY);

      const { data, key, version: sourceVersion } = JSON.parse(Utf8.stringify(Base64.parse(b64Data)));
      const targetVersion = this.engine.isFeatureEnabled(FeatureFlag.DATA_REFACTOR) ? ClipboardVersion.V3 : ClipboardVersion.V2;

      if (sourceVersion !== targetVersion) {
        throw new Error('cliboard version mismatch');
      }

      const decryptedData = synchronousCrypto.decryptDataByEncryptedKeys(copiedKey, key, data);

      return JSON.parse(decryptedData) as ClipboardContext;
    },

    importClipboardContextV2: async ({ slots, intents, products, diagrams, nodes, data, platform: sourcePlatform }: ClipboardContext) => {
      const state = this.engine.store.getState();
      const targetPlatform = Skill.activePlatformSelector(state);
      const isPlatformConversion = sourcePlatform !== targetPlatform;
      const slotTypes = activeSlotTypesSelector(state).map((slot) => slot.value);
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
        handlePastedNodes({
          nodes: nodesWithData,
          products: targetPlatform !== PlatformType.ALEXA ? [] : products,
          diagrams,
          sourcePlatform,
          targetPlatform,
        })
      );
    },

    importClipboardContext: async (skillID: string, { slots, intents, products, displays, diagrams, legacyNodes }: ClipboardContext) => {
      this.dispatch(Slot.addSlots(slots));
      this.dispatch(Intent.addIntents(intents));

      const { newNodes, newDiagrams } = await client.clipboard.paste(skillID, {
        nodes: legacyNodes,
        products,
        displays,
        diagrams,
      });

      this.dispatch(Diagrams.addDiagrams(diagrams.map((diagram) => ({ ...diagram, subDiagrams: [], id: newDiagrams[diagram.id] }))));
      await Promise.all<any>([
        this.dispatch(Display.loadDisplaysForSkill(skillID)),
        this.dispatch(Product.loadProductsForSkill(skillID)),
        ...diagrams.map((diagram) => this.dispatch(Diagrams.loadDiagramVariables(newDiagrams[diagram.id]))),
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
    const skillID = Skill.activeSkillIDSelector(state);
    const copyBuffer = Clipboard.deserialize(pastedText);
    const isDataRefactorEnabled = this.engine.isFeatureEnabled(FeatureFlag.DATA_REFACTOR);

    if (copyBuffer) {
      try {
        this.log.debug(this.log.pending('pasting to canvas'));

        const result = await this.internal.extractData(copyBuffer);

        const isSameSkill = result.skillID === skillID;

        let nodesWithData;

        if (isDataRefactorEnabled) {
          nodesWithData = isSameSkill
            ? result.nodes.map((node) => {
                const data = Creator.dataByNodeIDSelector(state)(node.id);

                return {
                  data,
                  node,
                };
              })
            : await this.internal.importClipboardContextV2(result);
        } else {
          const legacyNodes = isSameSkill ? result.legacyNodes : await this.internal.importClipboardContext(skillID, result);

          nodesWithData = legacyNodes.map((node: Models.DBNode) => {
            const nodeData = nodeDataAdapter.fromDB(node.extras, node);

            return {
              data: nodeData,
              node: nodeAdapter.fromDB(node, nodeData, node.parentNode),
            };
          });
        }

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
