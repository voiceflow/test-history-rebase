import type { DesignerActionContext, LegacyVersionActionContext } from '@voiceflow/sdk-logux-designer/build/types';

import { CMSContext } from '@/types';

export const toPostgresEntityID = <ID extends string | number>(entityOrID: ID | { id: ID }): ID =>
  typeof entityOrID === 'object' ? entityOrID.id : entityOrID;

export const toPostgresEntityIDs = <ID extends string | number>(entities: Array<ID | { id: ID }>): ID[] => entities.map(toPostgresEntityID);

export const toCMSEntityCompositeID = <Entity extends { id: string; environmentID: string }>({ id, environmentID }: Entity) => ({
  id,
  environmentID,
});

export const toCMSEntityCompositeIDs = <Entity extends { id: string; environmentID: string }>(entities: Entity[]) =>
  entities.map(toCMSEntityCompositeID);

export const injectAssistantAndEnvironmentIDs =
  ({ assistantID, environmentID }: Pick<CMSContext, 'assistantID' | 'environmentID'>) =>
  <Entity>(entity: Entity) => ({ ...entity, assistantID, environmentID });

export const legacyVersionBroadcastContext = <T extends { versionID: string; projectID: string; workspaceID: string }>({
  versionID,
  projectID,
  workspaceID,
}: T): LegacyVersionActionContext => ({
  versionID,
  projectID,
  workspaceID,
  broadcastOnly: true,
});

export const cmsBroadcastContext = ({ assistantID, environmentID }: CMSContext): DesignerActionContext => ({
  assistantID,
  broadcastOnly: true,
  environmentID,
});
