import { AlexaProject } from '@voiceflow/alexa-types';
import { BaseModels, BaseText, BaseVersion } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import {
  DiagramEntity,
  DiagramJSONAdapter,
  ObjectId,
  ProjectCustomTheme,
  ProjectEntity,
  ToJSON,
  VersionDomain,
  VersionEntity,
  VersionFolder,
  VersionFolderItem,
  VersionNote,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import * as SlateSerializer from '@voiceflow/slate-serializer';
import _mapValues from 'lodash/mapValues';
import _unionWith from 'lodash/unionWith';
import { Element as SlateElement } from 'slate';

interface Options {
  creatorID: number;
  targetProject: ProjectEntity;
  targetVersion: VersionEntity;
  sourceProject: ProjectEntity;
  sourceVersion: VersionEntity;
  sourceDiagrams: DiagramEntity[];
}

export class ProjectsMerge {
  private creatorID: number;

  private targetProject: ProjectEntity;

  private targetVersion: VersionEntity;

  private sourceProject: ProjectEntity;

  private sourceVersion: VersionEntity;

  private sourceDiagrams: DiagramEntity[];

  private newNotes: Record<string, VersionNote> = {};

  private newFolders: Record<string, VersionFolder> = {};

  private newDomains: VersionDomain[] = [];

  private newProducts: Record<string, AlexaProject.Product> = {};

  private newDiagrams: ToJSON<DiagramEntity>[] = [];

  private mergedSlots: BaseModels.Slot[] = [];

  private newVariables: string[] = [];

  private mergedIntents: BaseModels.Intent[] = [];

  private newComponents: VersionFolderItem[] = [];

  private newCustomThemes: ProjectCustomTheme[] = [];

  private noteIDsMap = new Map<string, string>();

  private slotKeysMap = new Map<string, string>();

  private domainIDsMap = new Map<string, string>();

  private folderIDsMap = new Map<string, string>();

  private intentKeysMap = new Map<string, string>();

  private productIDsMap = new Map<string, string>();

  private diagramIDsMap = new Map<string, string>();

  private mergedSlotsMap = new Map<string, BaseModels.Slot>();

  static isSlateVariableElement = (value: unknown): value is BaseText.VariableElement =>
    Utils.object.isObject(value) && SlateElement.isElement(value) && SlateSerializer.isVariableElement(value);

  constructor({ creatorID, targetProject, targetVersion, sourceProject, sourceVersion, sourceDiagrams }: Options) {
    this.creatorID = creatorID;
    this.targetProject = targetProject;
    this.targetVersion = targetVersion;
    this.sourceProject = sourceProject;
    this.sourceVersion = sourceVersion;
    this.sourceDiagrams = sourceDiagrams;
  }

  // validates if the input data is valid
  // domains are required for the merge
  private validate() {
    if (!this.sourceVersion.domains?.length) throw new Error('Source version has no domains');
    if (!this.targetVersion.domains?.length) throw new Error('Target version has no domains');

    const { type: sourceType } = Realtime.legacyPlatformToProjectType(
      this.sourceProject.platform as Platform.Constants.PlatformType,
      this.sourceProject.type as Platform.Constants.ProjectType
    );

    const { type: targetType } = Realtime.legacyPlatformToProjectType(
      this.targetProject.platform as Platform.Constants.PlatformType,
      this.targetProject.type as Platform.Constants.ProjectType
    );

    if (sourceType !== targetType) throw new Error(`Can't merge assistants of different types.`);
  }

  private mergeProjects() {
    this.mergeProducts();
    this.mergeCustomThemes();
  }

  private mergeProducts() {
    // skip merge if target project is not an Alexa project
    if (this.targetProject.platform !== Platform.Constants.PlatformType.ALEXA) return;

    const { products: sourceProducts = {} } = this.sourceProject.platformData as Partial<AlexaProject.PlatformData>;
    const { products: targetProducts = {} } = this.targetProject.platformData as Partial<AlexaProject.PlatformData>;

    // nothing to merge if there's no products in the source project
    if (!Object.keys(sourceProducts).length) return;

    // just copy if there's no products in the target project
    if (!Object.keys(targetProducts).length) {
      this.newProducts = sourceProducts;

      return;
    }

    const { union: conflictingProductIDs } = Utils.array.findUnion(Object.keys(targetProducts), Object.keys(sourceProducts));

    // remapping only conflicting product ids
    conflictingProductIDs.forEach((productID) => this.productIDsMap.set(productID, Utils.id.cuid.slug()));
    this.newProducts = Utils.id.remapObjectIDs(sourceProducts, this.productIDsMap);
  }

  private mergeCustomThemes() {
    const { customThemes: sourceCustomThemes } = this.sourceProject;
    const { customThemes: targetCustomThemes } = this.targetProject;

    // nothing to merge if there's no custom themes in the source project
    if (!sourceCustomThemes?.length) return;

    // just copy if there's no customThemes in the target project
    if (!targetCustomThemes?.length) {
      this.newCustomThemes = sourceCustomThemes;

      return;
    }

    const { rhsOnly: sourceOnlyStandardColors } = Utils.array.findUnion(
      targetCustomThemes.map((theme) => theme.standardColor),
      sourceCustomThemes.map((theme) => theme.standardColor)
    );

    // adding only uniq themes
    this.newCustomThemes = sourceCustomThemes.filter((theme) => sourceOnlyStandardColors.includes(theme.standardColor));
  }

  private mergeVersions() {
    this.mergeNotes();
    this.mergeDomains();
    this.mergeVariables();
    this.mergeComponents();
    this.mergeFolders(); // folders must be merged after domains and components
    this.migratePlatformData();
  }

  private mergeNotes() {
    const { notes: sourceNotes = {} } = this.sourceVersion;
    const { notes: targetNotes = {} } = this.targetVersion;

    // nothing to merge if there's no notes in the source version
    if (!Object.keys(sourceNotes).length) return;

    // just copy if there's no notes in the target version
    if (!Object.keys(targetNotes).length) {
      this.newNotes = sourceNotes;

      return;
    }

    const { union: conflictingNoteIDs } = Utils.array.findUnion(Object.keys(targetNotes), Object.keys(sourceNotes));

    // remapping only conflicting note ids
    conflictingNoteIDs.forEach((noteID) => this.noteIDsMap.set(noteID, Utils.id.cuid.slug()));

    this.newNotes = Utils.id.remapObjectIDs(sourceNotes, this.noteIDsMap);
  }

  private mergeDomains() {
    const { domains: sourceDomains = [], rootDiagramID: sourceRootDiagramID } = this.sourceVersion;
    const { domains: targetDomains = [] } = this.targetVersion;

    // nothing to merge if there's no domains in the source version
    if (!sourceDomains.length) return;

    // remapping topicIDs
    sourceDomains.forEach((sourceDomain) => sourceDomain.topicIDs.forEach((topicID) => this.diagramIDsMap.set(topicID, Utils.id.objectID())));

    // change source root domain name to the source project name
    const rootSourceDomain = sourceDomains.find((sourceDomain) => sourceDomain.rootDiagramID === sourceRootDiagramID.toJSON());

    if (rootSourceDomain) {
      rootSourceDomain.name = this.sourceProject.name;
    }

    // just copy if there's no domains in the target project
    if (!targetDomains.length) {
      this.newDomains = Utils.id.remapObjectIDs(sourceDomains, this.diagramIDsMap);
      this.newDomains = this.newDomains.map((sourceDomain) => ({ ...sourceDomain, updatedAt: new Date(), updatedBy: this.creatorID }));

      return;
    }

    const { union: conflictingDomainIDs } = Utils.array.findUnion(
      targetDomains.map((domain) => domain.id),
      sourceDomains.map((domain) => domain.id)
    );

    // remapping only conflicting domain ids
    conflictingDomainIDs.forEach((domainID) => this.domainIDsMap.set(domainID, Utils.id.cuid.slug()));

    // double remap cause domains contains diagramIDs
    this.newDomains = Utils.id.remapObjectIDs(sourceDomains, this.domainIDsMap);

    this.newDomains = Utils.id.remapObjectIDs(this.newDomains, this.diagramIDsMap);

    this.newDomains = this.newDomains.map((sourceDomain) => ({ ...sourceDomain, updatedAt: new Date(), updatedBy: this.creatorID }));
  }

  private mergeFolders() {
    const { folders: sourceFolders = {} } = this.sourceVersion;
    const { folders: targetFolders = {} } = this.targetVersion;

    // nothing to merge if there's no folders in the source version
    if (!Object.keys(sourceFolders).length) return;

    // just copy if there's no folders in the target version
    if (!Object.keys(targetFolders).length) {
      this.newFolders = sourceFolders;

      return;
    }

    const { union: conflictingFolderIDs } = Utils.array.findUnion(Object.keys(targetFolders), Object.keys(sourceFolders));

    // remapping only conflicting note ids
    conflictingFolderIDs.forEach((folderID) => this.folderIDsMap.set(folderID, Utils.id.cuid.slug()));

    // double remap cause folder can contain diagramID
    this.newFolders = Utils.id.remapObjectIDs(sourceFolders, this.folderIDsMap);
    this.newFolders = Utils.id.remapObjectIDs(this.newFolders, this.diagramIDsMap);
  }

  private mergeVariables() {
    const { variables: sourceVariables = [] } = this.sourceVersion;
    const { variables: targetVariables = [] } = this.targetVersion;

    // nothing to merge if there's no variables in the source version
    if (!sourceVariables.length) return;

    // just copy if there's no variables in the target version
    if (!targetVariables.length) {
      this.newVariables = sourceVariables;

      return;
    }

    const { rhsOnly: sourceOnlyVariables } = Utils.array.findUnion(targetVariables, sourceVariables);

    // adding only uniq variables
    this.newVariables = sourceOnlyVariables;
  }

  private mergeComponents() {
    const { components: sourceComponents = [] } = this.sourceVersion;

    // nothing to merge if there's no components in the source version
    if (!sourceComponents.length) return;

    sourceComponents.forEach((sourceComponent) => this.diagramIDsMap.set(sourceComponent.sourceID, Utils.id.objectID()));

    this.newComponents = Utils.id.remapObjectIDs(sourceComponents, this.diagramIDsMap);
  }

  private migratePlatformData() {
    this.mergeSlots();
    this.mergeIntents(); // intents migration must be done after slots migration
  }

  private mergeSlots() {
    const { slots: sourceSlots } = this.sourceVersion.platformData as BaseVersion.PlatformData;
    const { slots: targetSlots } = this.targetVersion.platformData as BaseVersion.PlatformData;

    // nothing to merge if there's no slots in the source version
    if (!sourceSlots.length) return;

    // just copy if there's no slots in the target version
    if (!targetSlots.length) {
      this.mergedSlots = sourceSlots;

      return;
    }

    const targetSlotByKeyMap = new Map(targetSlots.map((slot) => [slot.key, slot]));
    const targetSlotByNameMap = new Map(targetSlots.map((slot) => [slot.name, slot]));
    const sourceSlotByNameMap = new Map(sourceSlots.map((slot) => [slot.name, slot]));

    const {
      union: conflictingSlotNames,
      lhsOnly: targetOnlySlotNames,
      rhsOnly: sourceOnlySlotNames,
    } = Utils.array.findUnion(
      targetSlots.map((slot) => slot.name),
      sourceSlots.map((slot) => slot.name)
    );

    const targetOnlySlots = targetOnlySlotNames.map((slotName) => targetSlotByNameMap.get(slotName)!);

    const mergedSlots = conflictingSlotNames.map((slotName) => {
      const targetSlot = targetSlotByNameMap.get(slotName)!;
      const sourceSlot = sourceSlotByNameMap.get(slotName)!;

      // remapping source key to target key
      this.slotKeysMap.set(sourceSlot.key, targetSlot.key);

      const targetInputsMap = new Map<string, string[]>(targetSlot.inputs.map(Utils.slot.getValueWithSynonyms));
      const sourceInputsMap = new Map<string, string[]>(sourceSlot.inputs.map(Utils.slot.getValueWithSynonyms));

      // merging inputs
      const inputs = Utils.array.mergeByIdentifier(
        Array.from(targetInputsMap.entries()),
        Array.from(sourceInputsMap.entries()),
        ([value]) => value,
        ([value, synonyms], [, newSynonyms]): [string, string[]] => [
          value,
          // merge synonyms, but keep only uniq ones
          Utils.array.unique([...synonyms, ...newSynonyms.filter((synonym) => synonym !== value)]),
        ]
      );

      return { ...targetSlot, inputs: inputs.map(([value, synonyms]) => [value, ...synonyms].join(',')) };
    });

    // adding only uniq source slots, remapping slot key if it conflicts with any target slot keys
    const sourceOnlySlots = sourceOnlySlotNames.map((slotName) => {
      const sourceSlot = sourceSlotByNameMap.get(slotName)!;

      // do not remap slot key if it doesn't conflict with target slot keys
      if (!targetSlotByKeyMap.has(sourceSlot.key)) return sourceSlot;

      // remapping slot key to a new one to avoid conflicts
      const newSlotKey = Utils.id.cuid.slug();
      this.slotKeysMap.set(sourceSlot.key, newSlotKey);

      return { ...sourceSlot, key: newSlotKey };
    });

    this.mergedSlots = [...targetOnlySlots, ...mergedSlots, ...sourceOnlySlots];
    this.mergedSlotsMap = new Map(this.mergedSlots.map((slot) => [slot.key, slot]));
  }

  private remapTextSlotAnnotations = (prompt = ''): string =>
    Utils.slot.mapSlotAnnotations(prompt ?? '', ({ key, name }) => this.mergedSlotsMap.get(this.slotKeysMap.get(key) ?? key) ?? { key, name });

  private remapSlateVariable = (element: BaseText.VariableElement): BaseText.VariableElement => {
    const newID = this.slotKeysMap.get(element.id) ?? element.id;

    return { ...element, id: newID, name: this.mergedSlotsMap.get(newID)?.name ?? element.name };
  };

  private remapSlateContentSlotPrompt = (content: BaseText.SlateTextValue): BaseText.SlateTextValue =>
    content.map((element) => {
      if (ProjectsMerge.isSlateVariableElement(element)) {
        return this.remapSlateVariable(element);
      }

      if (SlateElement.isElement(element)) {
        return { ...element, children: this.remapSlateContentSlotPrompt(element.children) };
      }

      return element;
    });

  private remapIntentPrompt = (value: unknown): unknown => {
    if (Platform.Common.Voice.CONFIG.utils.intent.isPrompt(value)) {
      return {
        ...value,
        text: this.remapTextSlotAnnotations(value.text),
        slots: value.slots?.map((key) => this.slotKeysMap.get(key) ?? key),
      };
    }

    if (Platform.Common.Chat.CONFIG.utils.prompt.isPrompt(value)) {
      return {
        ...value,
        content: this.remapSlateContentSlotPrompt(value.content),
      };
    }

    return value;
  };

  private remapIntentInput = (input: BaseModels.IntentInput): BaseModels.IntentInput => ({
    ...input,
    text: this.remapTextSlotAnnotations(input.text),
    slots: input.slots?.map((key) => this.slotKeysMap.get(key) ?? key),
  });

  private remapIntentInputs = (input: BaseModels.IntentInput[] = []): BaseModels.IntentInput[] => input.map(this.remapIntentInput);

  private mergeIntents() {
    const { intents: sourceIntents } = this.sourceVersion.platformData as BaseVersion.PlatformData;
    const { intents: targetIntents } = this.targetVersion.platformData as BaseVersion.PlatformData;

    // nothing to merge if there's no intents in the source version
    if (!sourceIntents.length) return;

    // just copy if there's no intents in the target version
    if (!targetIntents.length) {
      this.mergedIntents = sourceIntents;

      return;
    }

    // remapping source intents data before merging
    const remappedSourceIntents = sourceIntents.map<BaseModels.Intent>((intent) => {
      const remappedSlots = intent.slots?.map<BaseModels.IntentSlot>((slot) => ({
        ...slot,
        id: this.slotKeysMap.get(slot.id) ?? slot.id,
        dialog: {
          ...slot.dialog,
          prompt: slot.dialog?.prompt?.map(this.remapIntentPrompt),
          confirm: slot.dialog?.confirm?.map(this.remapIntentPrompt),
          utterances: this.remapIntentInputs(slot.dialog?.utterances),
        },
      }));

      return {
        ...intent,
        slots: remappedSlots,
        inputs: this.remapIntentInputs(intent.inputs),
        noteID: intent.noteID ? this.noteIDsMap.get(intent.noteID) ?? intent.noteID : undefined,
      };
    });

    const targetIntentByKeyMap = new Map(targetIntents.map((intent) => [intent.key, intent]));
    const targetIntentByNameMap = new Map(targetIntents.map((intent) => [intent.name, intent]));
    const remappedSourceIntentByNameMap = new Map(remappedSourceIntents.map((intent) => [intent.name, intent]));

    const {
      union: conflictingIntentNames,
      lhsOnly: targetOnlyIntentNames,
      rhsOnly: remappedSourceOnlyIntentNames,
    } = Utils.array.findUnion(
      targetIntents.map((intent) => intent.name),
      remappedSourceIntents.map((intent) => intent.name)
    );

    const targetOnlyIntents = targetOnlyIntentNames.map((intentName) => targetIntentByNameMap.get(intentName)!);

    const mergedIntents = conflictingIntentNames.map((intentName) => {
      const targetIntent = targetIntentByNameMap.get(intentName)!;
      const remappedSourceIntent = remappedSourceIntentByNameMap.get(intentName)!;

      // remapping source key to target key
      this.intentKeysMap.set(remappedSourceIntent.key, targetIntent.key);

      // merging inputs
      const inputs = _unionWith(
        targetIntent.inputs,
        remappedSourceIntent.inputs,
        (targetInput, sourceInput) => targetInput.text === sourceInput.text
      );

      // merging slots
      const slots = _unionWith(
        targetIntent.slots ?? [],
        remappedSourceIntent.slots ?? [],
        (targetSlot, sourceSlot) => targetSlot.id === sourceSlot.id
      );

      return { ...targetIntent, inputs, slots, noteID: targetIntent.noteID ?? remappedSourceIntent.noteID };
    });

    // adding only uniq source intents, remapping intent key if it conflicts with any target intent keys
    const remappedSourceOnlyIntents = remappedSourceOnlyIntentNames.map((intentName) => {
      const remappedSourceIntent = remappedSourceIntentByNameMap.get(intentName)!;

      // do not remap intent key if it doesn't conflict with target intent keys
      if (!targetIntentByKeyMap.has(remappedSourceIntent.key)) return remappedSourceIntent;

      // remapping intent key to a new one to avoid conflicts
      const newIntentKey = Utils.id.cuid.slug();
      this.intentKeysMap.set(remappedSourceIntent.key, newIntentKey);

      return { ...remappedSourceIntent, key: newIntentKey };
    });

    this.mergedIntents = [...targetOnlyIntents, ...mergedIntents, ...remappedSourceOnlyIntents];
  }

  private mergeDiagrams() {
    // remapping source diagram ids
    this.sourceDiagrams.forEach((diagram) => {
      if (this.diagramIDsMap.has(diagram.diagramID.toJSON())) return;

      this.diagramIDsMap.set(diagram.diagramID.toJSON(), Utils.id.objectID());
    });

    this.newDiagrams = this.sourceDiagrams.map(({ nodes, ...diagram }) => {
      const remappedNodes = _mapValues(nodes, (node) => {
        // it should be safe to create a huge remap ids map to remap everything in a single iteration
        const combinedIDsMap = new Map([
          ...this.noteIDsMap.entries(),
          ...this.slotKeysMap.entries(),
          ...this.domainIDsMap.entries(),
          ...this.intentKeysMap.entries(),
          ...this.productIDsMap.entries(),
          ...this.diagramIDsMap.entries(),
        ]);

        const remappedNode = this.deepMapNode(node, (value) => {
          if (ProjectsMerge.isSlateVariableElement(value)) {
            return this.remapSlateVariable(value);
          }

          if (typeof value === 'string') {
            return this.remapTextSlotAnnotations(value);
          }

          return value;
        });

        return combinedIDsMap.size ? Utils.id.remapObjectIDs(remappedNode, combinedIDsMap) : remappedNode;
      });

      return {
        ...Utils.id.remapObjectIDs(DiagramJSONAdapter.fromDB(diagram), this.diagramIDsMap),
        _id: new ObjectId().toJSON(),
        nodes: remappedNodes,
        creatorID: this.creatorID,
        versionID: this.targetVersion.id,
        diagramID: this.diagramIDsMap.get(diagram.diagramID.toJSON())!,
      };
    });
  }

  // port of the original deepMap function, but runs mapFunction on every value instead if just primitives
  private deepMapNode = (
    node: BaseModels.BaseDiagramNode<AnyRecord>,
    mapFunction: (value: any, key?: string | number, parent?: Array<any> | AnyRecord) => any
  ): BaseModels.BaseDiagramNode<AnyRecord> => {
    const cache = new WeakMap<object, unknown>();

    const mapArray = (arr: unknown[]): unknown[] => {
      if (cache.has(arr)) {
        return cache.get(arr) as unknown[];
      }

      const result = arr;

      cache.set(arr, result);

      const { length } = arr;
      for (let index = 0; index < length; index++) {
        result[index] = map(arr[index], index, arr);
      }

      return result;
    };

    const mapObject = (obj: AnyRecord): AnyRecord => {
      if (cache.has(obj)) {
        return cache.get(obj) as AnyRecord;
      }

      const result = obj;

      cache.set(obj, result);

      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(obj)) {
        result[key] = map(obj[key], key, obj);
      }

      return result;
    };

    const map = (value: unknown, key?: string | number, parent?: Array<any> | AnyRecord) => {
      if (Array.isArray(value)) return mapArray(mapFunction(value, key, parent));
      if (Utils.object.isObject(value)) return mapObject(mapFunction(value, key, parent));

      return mapFunction(value, key);
    };

    return map(node) as BaseModels.BaseDiagramNode<AnyRecord>;
  };

  public perform() {
    this.validate();
    this.mergeProjects();
    this.mergeVersions();
    this.mergeDiagrams();

    return {
      newNotes: this.newNotes,
      newFolders: this.newFolders,
      newDomains: this.newDomains,
      newProducts: this.newProducts,
      newDiagrams: this.newDiagrams,
      mergedSlots: this.mergedSlots,
      newVariables: this.newVariables,
      mergedIntents: this.mergedIntents,
      newComponents: this.newComponents,
      newCustomThemes: this.newCustomThemes,
    };
  }
}
