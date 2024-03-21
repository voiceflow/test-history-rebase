/* eslint-disable max-depth */

import { Channel, EntityWithVariants, Language } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import { Designer } from '@/ducks';
import { getManager } from '@/pages/Canvas/managers';
import type { State } from '@/store/types';
import { isTopicDiagram } from '@/utils/diagram.utils';
import { utteranceTextToString } from '@/utils/utterance.util';

import {
  DatabaseEntry,
  DiagramDatabaseEntry,
  EntityDatabaseEntry,
  Filters,
  IntentDatabaseEntry,
  NODE_CATEGORY_ORDER,
  NodeCategory,
  NodeDatabaseEntry,
  SEARCH_CATEGORY_ORDER,
  SearchCategory,
  SearchDatabase,
} from './types';

export const EmptySearchDatabase: SearchDatabase = SEARCH_CATEGORY_ORDER.reduce<SearchDatabase>((acc, category) => {
  acc[category] = [];
  return acc;
}, {} as SearchDatabase);

export const isNodeDatabaseEntry = (entry: DatabaseEntry & { nodeID?: string }): entry is NodeDatabaseEntry => !!entry.nodeID;
export const isIntentDatabaseEntry = (entry: DatabaseEntry & { intentID?: string }): entry is IntentDatabaseEntry => !!entry.intentID;
export const isEntityDatabaseEntry = (entry: DatabaseEntry & { entityID?: string }): entry is EntityDatabaseEntry => !!entry.entityID;
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

export const buildIntentDatabase = (state: State): IntentDatabaseEntry[] => {
  const intents = Designer.Intent.selectors.allWithFormattedBuiltInNames(state);

  return intents.map((intent) => {
    const entry: IntentDatabaseEntry = { intentID: intent.id, targets: [intent.name] };
    const utterances = Designer.Intent.Utterance.selectors.allByIntentID(state, { intentID: intent.id });
    const requiredEntities = Designer.Intent.RequiredEntity.selectors.allByIDs(state, { ids: intent.entityOrder });
    const entitiesMap = Designer.Entity.selectors.map(state);

    utterances.forEach(({ text }) => {
      entry.targets.push(utteranceTextToString.fromDB(text, { entitiesMapByID: entitiesMap }));
    });

    requiredEntities.forEach(({ repromptID }) => {
      const variants = Designer.selectors.allStringResponseVariantsByLanguageChannelResponseID(state, {
        responseID: repromptID,
        channel: Channel.DEFAULT,
        language: Language.ENGLISH_US,
      });

      entry.targets.push(...variants);
    });

    return entry;
  });
};

export const buildEntityDatabase = (entities: EntityWithVariants[]): EntityDatabaseEntry[] =>
  entities.map((entity) => ({
    entityID: entity.id,
    targets: [entity.name, ...entity.variants.flatMap((variant) => [variant.value, ...variant.synonyms])],
  }));

export const buildDiagramDatabases = (diagrams: Realtime.Diagram[]): Pick<SearchDatabase, SearchCategory.COMPONENT | SearchCategory.TOPIC> => {
  const database: Pick<SearchDatabase, SearchCategory.COMPONENT | SearchCategory.TOPIC> = {
    [SearchCategory.COMPONENT]: [],
    [SearchCategory.TOPIC]: [],
  };

  diagrams.forEach((diagram) => {
    const entry: DiagramDatabaseEntry = { diagramID: diagram.id, diagramType: diagram.type, targets: [diagram.name] };
    if (isTopicDiagram(diagram.type)) {
      database[SearchCategory.TOPIC].push(entry);
    } else {
      database[SearchCategory.COMPONENT].push(entry);
    }
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
  if (isEntityDatabaseEntry(entry)) {
    return 'setV2';
  }

  if (isIntentDatabaseEntry(entry)) {
    return 'intent';
  }

  if (isDiagramDatabaseEntry(entry)) {
    return isTopicDiagram(entry.diagramType) ? 'systemLayers' : 'componentOutline';
  }
  return 'search';
};
