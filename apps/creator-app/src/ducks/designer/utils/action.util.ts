import { parseId } from '@logux/core';
import { Utils } from '@voiceflow/common';

export const extractUpdatedByIDFromMeta = (meta?: unknown): number | null => {
  const clientID =
    Utils.object.isObject(meta) &&
    (Utils.object.hasProperty(meta, 'origin') || Utils.object.hasProperty(meta, 'clientID'))
      ? meta.origin || meta.clientID
      : undefined;

  const userID = typeof clientID === 'string' ? parseId(clientID).userId ?? null : null;
  const updatedByID = userID !== null ? Number(userID) : null;

  return Number.isNaN(updatedByID) ? null : updatedByID;
};

export const patchWithUpdatedFields = <T extends object>({
  meta,
  payload,
}: {
  meta?: unknown;
  payload: { patch: T };
}): T & { updatedAt: string; updatedByID?: number } => {
  const updatedByID = extractUpdatedByIDFromMeta(meta);

  return {
    updatedAt: new Date().toJSON(),
    ...(updatedByID !== null && { updatedByID: Number(updatedByID) }),
    ...payload.patch,
  };
};
