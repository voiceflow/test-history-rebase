export enum Mutability {
  MUTABLE = 'MUTABLE',
  IMMUTABLE = 'IMMUTABLE',
}

export enum PushAction {
  APPLY_ENTITY = 'apply-entity',
  REMOVE_RANGE = 'remove-range',
  DELETE_CHARACTER = 'delete-character',
  INSERT_CHARACTERS = 'insert-characters',
}

export enum PluginType {
  XML = 'XML',
  BASE = 'BASE',
  VARIABLES = 'VARIABLES',
}

export enum EntityType {
  VARIABLE = '{mention',
  XML_OPEN_TAG = 'xml-open-tag',
  XML_CLOSE_TAG = 'xml-close-tag',
  FAKE_SELECTION = 'fake-selection',
}

export const ENTITY_TYPE_PLUGIN_TYPE = {
  [EntityType.VARIABLE]: PluginType.VARIABLES,
  [EntityType.XML_OPEN_TAG]: PluginType.XML,
  [EntityType.XML_CLOSE_TAG]: PluginType.XML,
};
