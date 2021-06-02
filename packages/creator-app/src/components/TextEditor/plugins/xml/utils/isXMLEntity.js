import { ENTITY_TYPE_PLUGIN_TYPE, PluginType } from '../../constants';

export default (entity) => !!entity && ENTITY_TYPE_PLUGIN_TYPE[entity.getType?.()] === PluginType.XML;
