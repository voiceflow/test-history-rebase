/* eslint-disable max-depth */
/* eslint-disable no-restricted-syntax */

import { SLOT_REGEXP } from '@voiceflow/common';
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
  NODE_CATEGORY_ORDER,
  NodeCategory,
  NodeDatabaseEntry,
  SEARCH_CATEGORY_ORDER,
  SearchCategory,
  SlotDatabaseEntry,
} from './types';

export interface SearchDatabase {
  [SearchCategory.INTENT]: IntentDatabaseEntry[];
  [SearchCategory.ENTITIES]: SlotDatabaseEntry[];
  [SearchCategory.NODE]: NodeDatabaseEntry[];
  [SearchCategory.COMPONENT]: DiagramDatabaseEntry[];
}

export const EmptySearchDatabase: SearchDatabase = SEARCH_CATEGORY_ORDER.reduce<SearchDatabase>((acc, category) => {
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
      icon: manager.searchIcon || manager.icon || manager.getIcon?.(node as any),
      nodeID,
      targets,
      category: manager.searchCategory,
      diagramID,
    });
  });

  return database;
};

export const buildIntentDatabase = (intents: Platform.Base.Models.Intent.Model[]): IntentDatabaseEntry[] =>
  intents.map((intent) => {
    const entry: IntentDatabaseEntry = { intentID: intent.id, targets: [intent.name] };

    intent.inputs.forEach((input) => {
      entry.targets.push(input.text.replace(SLOT_REGEXP, '{$1}'));
    });

    Object.values(intent.slots.byKey).forEach((intentSlot: Platform.Base.Models.Intent.Slot) => {
      intentSlot.dialog.utterances.forEach((utterance) => {
        entry.targets.push(utterance.text.replace(SLOT_REGEXP, '{$1}'));
      });
    });

    return entry;
  });

export const buildSlotDatabase = (slots: Realtime.Slot[]): SlotDatabaseEntry[] => slots.map((slot) => ({ slotID: slot.id, targets: [slot.name] }));

export const buildDiagramDatabases = (diagrams: Realtime.Diagram[]): Pick<SearchDatabase, SearchCategory.COMPONENT> => {
  const database: Pick<SearchDatabase, SearchCategory.COMPONENT> = {
    [SearchCategory.COMPONENT]: [],
  };

  diagrams.forEach((diagram) => {
    const entry: DiagramDatabaseEntry = { diagramID: diagram.id, diagramType: diagram.type, targets: [diagram.name] };

    database[SearchCategory.COMPONENT].push(entry);
  });

  return database;
};

export type CreateOption<T extends { index: number }> = (params: { target: string; index: number; entry: DatabaseEntry }) => T;

export const find = <T extends { index: number }>(
  query: string,
  database: SearchDatabase,
  createOption: CreateOption<T>,
  filters: Filters = {}
): T[] => {
  if (!query.length) return [];

  const categoryFilters = SEARCH_CATEGORY_ORDER.reduce<SearchCategory[]>((acc, searchCategory) => {
    if (filters[searchCategory] !== false) acc.push(searchCategory);

    return acc;
  }, []);

  const rejectedNodeCategories = new Set(
    NODE_CATEGORY_ORDER.reduce<NodeCategory[]>((acc, nodeCategory) => {
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

  return options.sort((a, b) => a.index - b.index);
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
    return 'componentOutline';
  }
  return 'search';
};
