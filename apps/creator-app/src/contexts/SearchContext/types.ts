import { BaseModels } from '@voiceflow/base-types';
import { SvgIconTypes } from '@voiceflow/ui';

export interface BaseDatabaseEntry {
  targets: string[];
}

export enum NodeCategory {
  BLOCK = 'Blocks',
  RESPONSES = 'Responses',
  USER_INPUT = 'User inputs',
}

export const NODE_CATEGORY_ORDER: NodeCategory[] = [NodeCategory.BLOCK, NodeCategory.RESPONSES, NodeCategory.USER_INPUT];

export interface NodeDatabaseEntry extends BaseDatabaseEntry {
  diagramID: string;
  nodeID: string;
  category?: NodeCategory;
  icon?: SvgIconTypes.Icon;
}

export interface IntentDatabaseEntry extends BaseDatabaseEntry {
  intentID: string;
}

export interface CMSIntentDatabaseEntry extends BaseDatabaseEntry {
  cmsIntentID: string;
}

export interface SlotDatabaseEntry extends BaseDatabaseEntry {
  slotID: string;
}

export interface EntityDatabaseEntry extends BaseDatabaseEntry {
  entityID: string;
}

export interface DiagramDatabaseEntry extends BaseDatabaseEntry {
  diagramType: BaseModels.Diagram.DiagramType;
  diagramID: string;
}

export enum SearchCategory {
  INTENT = 'Intents',
  ENTITIES = 'Entities',
  NODE = 'Node',
  COMPONENT = 'Components',
  TOPIC = 'Topics',
}

export const SEARCH_CATEGORY_ORDER: SearchCategory[] = [
  SearchCategory.NODE,
  SearchCategory.COMPONENT,
  SearchCategory.TOPIC,
  SearchCategory.INTENT,
  SearchCategory.ENTITIES,
];

export type Filters = Partial<Record<SearchCategory | NodeCategory, boolean>>;

export type DatabaseEntry =
  | SlotDatabaseEntry
  | NodeDatabaseEntry
  | IntentDatabaseEntry
  | EntityDatabaseEntry
  | DiagramDatabaseEntry
  | CMSIntentDatabaseEntry;

export interface SearchDatabase {
  [SearchCategory.NODE]: NodeDatabaseEntry[];
  [SearchCategory.TOPIC]: DiagramDatabaseEntry[];
  [SearchCategory.INTENT]: Array<IntentDatabaseEntry | CMSIntentDatabaseEntry>;
  [SearchCategory.ENTITIES]: Array<SlotDatabaseEntry | EntityDatabaseEntry>;
  [SearchCategory.COMPONENT]: DiagramDatabaseEntry[];
}
