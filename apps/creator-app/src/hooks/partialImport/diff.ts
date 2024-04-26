import type { BaseModels } from '@voiceflow/base-types';
import { id } from '@voiceflow/common';
import ObjectID from 'bson-objectid';
import hash from 'object-hash';

import { isComponentDiagram, isTopicDiagram } from '@/utils/diagram.utils';

export interface VF_FILE {
  project: BaseModels.Project.Model<any, any>;
  version: BaseModels.Version.Model<BaseModels.Version.PlatformData>;
  diagrams: Record<string, BaseModels.Diagram.Model<any>>;
}

export interface Diff<R> {
  useNext: boolean;
  nextResource: R;
  currentResource?: R;
}

const getResourceDiff = <R>(
  getKey: (resource: R) => string,
  nextResources: R[] = [],
  currentResources: R[] = [],
  filter: (resource: R) => Partial<R> = (resource) => resource
): Diff<R>[] => {
  const currentResourceMap = Object.fromEntries(currentResources.map((resource) => [getKey(resource), resource]));

  return nextResources.reduce<Diff<R>[]>((acc, nextResource) => {
    const currentResource = currentResourceMap[getKey(nextResource)];
    if (!currentResource) {
      acc.push({ nextResource, useNext: false });
    } else if (hash(filter(nextResource)) !== hash(filter(currentResource))) {
      acc.push({ nextResource, currentResource, useNext: false });
    }

    return acc;
  }, []);
};

const getDiagramNameToIDMap = (
  diagrams: Record<string, BaseModels.Diagram.Model<any>>,
  domains: BaseModels.Version.Domain[] = []
) => {
  const topicDomainMap = Object.fromEntries(
    domains.flatMap((domain) => domain.topicIDs.map((topicID) => [topicID, domain.id])) || []
  );
  return Object.fromEntries(
    Object.values(diagrams).map((diagram) => [
      `${diagram.type}:${topicDomainMap[diagram._id] || ''}${diagram.name}`,
      diagram._id,
    ])
  );
};

export const getDiff = (next: VF_FILE, current: VF_FILE) => {
  const variables = getResourceDiff((variable) => variable, next.version.variables, current.version.variables);
  const intents = getResourceDiff(
    (intent) => intent.key,
    next.version.platformData.intents,
    current.version.platformData.intents
  );
  const entities = getResourceDiff(
    (entity) => entity.key,
    next.version.platformData.slots,
    current.version.platformData.slots
  );
  const customBlocks = getResourceDiff(
    (customBlock) => customBlock.key,
    Object.values(next.version.customBlocks || {}),
    Object.values(current.version.customBlocks || {})
  );

  // merge diagramIDs for imported, because duplicating/creating new versions generates new diagramIDs
  // TODO: we need a canonical ID system!!!

  // get a dictionary of imported diagram names (with domains) to their IDs
  const nextDiagramNameToIDMap = getDiagramNameToIDMap(next.diagrams, next.version.domains);

  // get a dictionary of current diagram names (with domains) to their IDs
  const currentDiagramNameToIDMap = getDiagramNameToIDMap(current.diagrams, current.version.domains);

  // create a mapping of imported diagram IDs to current diagram IDs based on the names
  // if the diagram doesn't have a corresponding current diagram, create a new ID
  const nextDiagramIDMap = Object.fromEntries(
    Object.entries(nextDiagramNameToIDMap).map(([name, id]) => [
      id,
      currentDiagramNameToIDMap[name] || current.diagrams[id]?._id || new ObjectID().toHexString(),
    ])
  );

  // replace all referenced diagramIDs in the imported diagrams with the current diagram IDs
  const remappedNextDiagrams = id.remapObjectIDs(next.diagrams, nextDiagramIDMap);
  const remappedVersion = id.remapObjectIDs(next.version, nextDiagramIDMap);

  // get the diff of the remapped diagrams
  const diagrams = getResourceDiff(
    (diagram) => diagram._id,
    Object.values(remappedNextDiagrams),
    Object.values(current.diagrams),
    // only compare select properties
    ({ nodes, name, menuItems, variables, type }) => ({ nodes, name, menuItems, variables, type })
  );

  return {
    diff: {
      intents,
      entities,
      topics: diagrams.filter((diagram) => isTopicDiagram(diagram.nextResource.type)),
      components: diagrams.filter((diagram) => isComponentDiagram(diagram.nextResource.type)),
      variables,
      customBlocks,
    },
    version: remappedVersion,
  };
};

export type VFDiff = ReturnType<typeof getDiff>;
