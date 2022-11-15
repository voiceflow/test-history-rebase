/* eslint-disable max-depth */
/* eslint-disable no-restricted-syntax */
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import { getManager } from '@/pages/Canvas/managers';
import type { State } from '@/store/types';

import {
  DatabaseEntry,
  DiagramDatabaseEntry,
  Filters,
  IntentDatabaseEntry,
  NodeCategory,
  NodeDatabaseEntry,
  SearchCategory,
  SlotDatabaseEntry,
} from './types';

export const AllSearchCategories = Object.values(SearchCategory);
export const AllNodeCategories = Object.values(NodeCategory);

export interface SearchDatabase {
  [SearchCategory.INTENT]: IntentDatabaseEntry[];
  [SearchCategory.ENTITIES]: SlotDatabaseEntry[];
  [SearchCategory.NODE]: NodeDatabaseEntry[];
  [SearchCategory.COMPONENT]: DiagramDatabaseEntry[];
  [SearchCategory.TOPIC]: DiagramDatabaseEntry[];
}

export const EmptySearchDatabase: SearchDatabase = AllSearchCategories.reduce<SearchDatabase>((acc, category) => {
  acc[category] = [];
  return acc;
}, {} as SearchDatabase);

export const isNodeDatabaseEntry = (entry: DatabaseEntry & { nodeID?: string }): entry is NodeDatabaseEntry => !!entry.nodeID;
export const isIntentDatabaseEntry = (entry: DatabaseEntry & { intentID?: string }): entry is IntentDatabaseEntry => !!entry.intentID;
export const isSlotDatabaseEntry = (entry: DatabaseEntry & { slotID?: string }): entry is SlotDatabaseEntry => !!entry.slotID;
export const isDiagramDatabaseEntry = (entry: DatabaseEntry & { diagramType?: string; diagramID?: string }): entry is DiagramDatabaseEntry =>
  !!entry.diagramType && !!entry.diagramID;

export const buildNodeDatabase = (nodes: Realtime.NodeData<unknown>[], diagramID: string, state: State) => {
  const database: NodeDatabaseEntry[] = [];
  nodes.forEach((node) => {
    const { type, nodeID } = node;
    const manager = getManager(type);
    if (!manager) return;

    const targets = manager.getSearchParams?.(node as any, state);
    if (!targets) return;

    database.push({
      nodeID,
      targets,
      icon: manager.searchIcon || manager.icon || manager.getIcon?.(node as any),
      diagramID,
      category: manager.searchCategory,
    });
  });

  return database;
};

export const buildIntentDatabase = (intents: Platform.Base.Models.Intent.Model[]): IntentDatabaseEntry[] =>
  intents.map((intent) => ({ intentID: intent.id, targets: [intent.name] }));

export const buildSlotDatabase = (slots: Realtime.Slot[]): SlotDatabaseEntry[] => slots.map((slot) => ({ slotID: slot.id, targets: [slot.name] }));

export const buildDiagramDatabases = (diagrams: Realtime.Diagram[]): Pick<SearchDatabase, SearchCategory.COMPONENT | SearchCategory.TOPIC> => {
  const database: Pick<SearchDatabase, SearchCategory.COMPONENT | SearchCategory.TOPIC> = {
    [SearchCategory.COMPONENT]: [],
    [SearchCategory.TOPIC]: [],
  };

  diagrams.forEach((diagram) => {
    const entry: DiagramDatabaseEntry = { diagramID: diagram.id, diagramType: diagram.type, targets: [diagram.name] };
    if (diagram.type === BaseModels.Diagram.DiagramType.TOPIC) {
      database[SearchCategory.TOPIC].push(entry);
    } else {
      database[SearchCategory.COMPONENT].push(entry);
    }
  });

  return database;
};

export type CreateOption<T> = (params: { target: string; index: number; entry: DatabaseEntry }) => T;

export const find = <T>(query: string, database: SearchDatabase, createOption: CreateOption<T>, filters: Filters = {}): T[] => {
  if (!query.length) return [];

  const categoryFilters = AllSearchCategories.reduce<SearchCategory[]>((acc, searchCategory) => {
    if (filters[searchCategory] !== false) acc.push(searchCategory);
    return acc;
  }, []);

  const rejectedNodeCategories = new Set(
    AllNodeCategories.reduce<NodeCategory[]>((acc, nodeCategory) => {
      if (filters[nodeCategory] === false) acc.push(nodeCategory);
      return acc;
    }, [])
  );

  const lowercaseQuery = query.toLowerCase();
  const options = [];

  for (const category of categoryFilters) {
    const isNode = category === SearchCategory.NODE;
    const entries = database[category];

    for (const entry of entries) {
      // filter out nodes in rejected categories
      if (isNode) {
        const category = (entry as NodeDatabaseEntry)?.category;
        if (category && rejectedNodeCategories.has(category)) continue;
      }

      for (const target of entry.targets) {
        // we can use fuzzy matching in the future
        const index = target.toLowerCase().indexOf(lowercaseQuery);

        if (index >= 0) {
          options.push(createOption({ target, index, entry }));
        }
      }
      if (options.length > 20) break;
    }
  }

  return options;
};

export const getDatabaseEntryIcon = (entry: DatabaseEntry): SvgIconTypes.Icon => {
  if (isNodeDatabaseEntry(entry) && entry.icon) {
    return entry.icon;
  }
  if (isSlotDatabaseEntry(entry)) {
    return 'setV2';
  }
  if (isIntentDatabaseEntry(entry)) {
    return 'intent';
  }
  if (isDiagramDatabaseEntry(entry)) {
    return entry.diagramType === BaseModels.Diagram.DiagramType.TOPIC ? 'systemLayers' : 'componentOutline';
  }
  return 'search';
};
