import { EntityType } from '../../constants';

const findTagStrategyCreator = (entityType) => () => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    return entityKey !== null && contentState.getEntity(entityKey).getType() === entityType;
  }, callback);
};

export const findOpenTagStrategy = findTagStrategyCreator(EntityType.XML_OPEN_TAG);
export const findOpenCloseStrategy = findTagStrategyCreator(EntityType.XML_CLOSE_TAG);
export const findFakeSelectionStrategy = findTagStrategyCreator(EntityType.FAKE_SELECTION);
