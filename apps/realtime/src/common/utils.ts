import type { EntityPKValue, PKOrEntity } from '@voiceflow/orm-designer';
import { isEntity } from '@voiceflow/orm-designer';

export const toEntityID = <Entity extends { id: EntityPKValue }>(entity: PKOrEntity<Entity>): Entity['id'] => (isEntity(entity) ? entity.id : entity);

export const toEntityIDs = <Entity extends { id: EntityPKValue }>(entities: PKOrEntity<Entity>[]): Entity['id'][] => entities.map(toEntityID);

export const groupByAssistant = <Entity extends { assistant: { id: string } }>(entities: Entity[]): Entity[][] => {
  const assistants: Record<string, Entity[]> = {};

  entities.forEach((entity) => {
    assistants[entity.assistant.id] ??= [];
    assistants[entity.assistant.id].push(entity);
  });

  return Object.values(assistants);
};

export const groupByAssistantID = <Entity extends { assistantID: string }>(entities: Entity[]): Entity[][] => {
  const assistants: Record<string, Entity[]> = {};

  entities.forEach((entity) => {
    assistants[entity.assistantID] ??= [];
    assistants[entity.assistantID].push(entity);
  });

  return Object.values(assistants);
};
