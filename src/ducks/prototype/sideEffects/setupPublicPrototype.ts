import _constant from 'lodash/constant';

import client from '@/client';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';

import { PrototypeLayout, PrototypeSettings } from '../types';

const setupPublicPrototype = (versionID: string): Thunk<PrototypeSettings> => async (dispatch) => {
  const isLegacyVersion = versionID.length !== 24; // check if object ID

  const prototype = await (isLegacyVersion
    ? client.prototype.getLegacyInfo(versionID).catch(_constant(null))
    : client.api.version.getPrototype(versionID, { isPublic: true }).catch(_constant(null)));

  if (!prototype) {
    throw new Error("Prototype doesn't exist");
  }

  dispatch(
    Skill.setActiveSkill(
      {
        id: versionID,
        name: prototype.data.name,
        locales: prototype.data.locales,
        rootDiagramID: prototype.context.stack?.[0].programID,
      } as any,
      prototype.context.stack?.[0].programID as string
    )
  );

  return {
    ...prototype?.settings,
    hasPassword: prototype?.settings.hasPassword ?? false,
    layout: prototype?.settings.layout ?? PrototypeLayout.TEXT_DIALOG,
  } as PrototypeSettings;
};

export default setupPublicPrototype;
