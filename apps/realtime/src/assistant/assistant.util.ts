export const buildCMSTabularEntitiesUpdatedFieldsMap = <
  Resource extends { id: string; updatedAt: Date; updatedByID: number },
>(
  resources: Resource[]
) =>
  Object.fromEntries(
    resources.map((resource) => [resource.id, { updatedAt: resource.updatedAt, updatedByID: resource.updatedByID }])
  );

export const adjustCMSTabularEntitiesUpdatedFieldsMap = <
  Reference extends { updatedAt: Date; updatedByID: number | null },
>(
  map: Partial<Record<string, { updatedAt: Date; updatedByID: number }>>,
  references: Reference[],
  getRootID: (reference: Reference) => string
) => {
  if (!references.length) return;

  for (const reference of references) {
    const rootID = getRootID(reference);
    const updatedFields = map[rootID];

    if (!updatedFields || reference.updatedByID === null || reference.updatedAt <= updatedFields.updatedAt) continue;

    // eslint-disable-next-line no-param-reassign
    map[rootID] = {
      updatedAt: reference.updatedAt,
      updatedByID: reference.updatedByID,
    };
  }
};

export const updateCMSTabularResourcesWithUpdatedFields = <
  Resource extends { id: string; updatedAt: string; updatedByID: number },
>(
  map: Partial<Record<string, { updatedAt: Date; updatedByID: number }>>,
  resources: Resource[]
) =>
  resources.map((resource) => {
    const updatedFields = map[resource.id];

    return {
      ...resource,
      ...updatedFields,
      updatedAt: updatedFields?.updatedAt.toJSON() ?? resource.updatedAt,
    };
  });
