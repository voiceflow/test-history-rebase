import type { BaseModels } from '@voiceflow/base-types';

export const findRootDomainID = (domains: BaseModels.Version.Domain[], rootDiagramID: string): string | null =>
  domains.find((d) => d.rootDiagramID === rootDiagramID)?.id ?? null;

export const findDomainIDByTopicID = (domains: BaseModels.Version.Domain[], topicID: string): string | null =>
  domains.find((d) => d.topicIDs.includes(topicID))?.id ?? null;

export const findDomainIDByDiagramID = (domains: BaseModels.Version.Domain[], diagramID: string): string | null =>
  domains.find((d) => d.rootDiagramID === diagramID || d.topicIDs.includes(diagramID))?.id ?? null;
