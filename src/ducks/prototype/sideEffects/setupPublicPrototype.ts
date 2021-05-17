import _constant from 'lodash/constant';

import client from '@/client';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';

import { PrototypeLayout, PrototypeSettings } from '../types';

const setupPublicPrototype = (versionID: string): Thunk<PrototypeSettings> => async (dispatch) => {
  const prototype = await client.api.version.getPrototype(versionID).catch(_constant(null));

  if (!prototype) {
    throw new Error("Prototype doesn't exist");
  }

  const { plan } = (await client.api.version.getPrototypePlan(versionID).catch(_constant(null))) || {};

  if (!plan) {
    throw new Error('Could not retrieve permissions for prototype share');
  }

  const rootDiagramID = prototype.context.stack?.[0].programID as string;

  dispatch(
    Skill.setActiveSkill(
      {
        id: versionID,
        name: prototype.data.name,
        locales: prototype.data.locales,
        rootDiagramID,
      } as any,
      rootDiagramID
    )
  );
  dispatch(Session.setActiveVersionID(versionID));
  dispatch(Session.setActiveDiagramID(rootDiagramID));

  return {
    ...prototype?.settings,
    hasPassword: prototype?.settings.hasPassword ?? false,
    layout: prototype?.settings.layout ?? PrototypeLayout.TEXT_DIALOG,
    plan,
  } as PrototypeSettings;
};

export default setupPublicPrototype;
