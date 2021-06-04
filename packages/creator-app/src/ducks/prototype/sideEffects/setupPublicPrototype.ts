import { ButtonsLayout } from '@voiceflow/general-types';
import _constant from 'lodash/constant';
import { batch } from 'react-redux';

import client from '@/client';
import { PlanType } from '@/constants';
import * as Session from '@/ducks/session';
import { addVersion } from '@/ducks/version/actions';
import { AnyLocale } from '@/ducks/version/types';
import { Thunk } from '@/store/types';

import { updatePrototype } from '../actions';
import { PrototypeLayout, PrototypeSettings } from '../types';

const setupPublicPrototype =
  (versionID: string): Thunk<PrototypeSettings> =>
  async (dispatch) => {
    const prototype = await client.api.version.getPrototype(versionID).catch(_constant(null));

    if (!prototype) {
      throw new Error("Prototype doesn't exist");
    }

    const { plan } = (await client.api.version.getPrototypePlan(versionID).catch(_constant(null))) || {};

    if (!plan) {
      throw new Error('Could not retrieve permissions for prototype share');
    }

    const rootDiagramID = prototype.context.stack?.[0].programID as string;
    const layout = (prototype?.settings.layout ?? PrototypeLayout.TEXT_DIALOG) as PrototypeLayout;

    batch(() => {
      dispatch(
        addVersion(versionID, {
          id: versionID,
          creatorID: null as any,
          projectID: null as any,
          rootDiagramID,
          variables: [],
          settings: {} as any,
          session: {} as any,
          publishing: {},
          status: null,
        })
      );
      dispatch(
        updatePrototype({
          muted: layout === PrototypeLayout.TEXT_DIALOG,
        })
      );
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveDiagramID(rootDiagramID));
    });

    return {
      ...prototype?.settings,
      plan: plan as PlanType,
      layout,
      buttons: prototype?.settings.buttons as ButtonsLayout,
      locales: prototype.data.locales as AnyLocale[],
      hasPassword: prototype?.settings.hasPassword ?? false,
      projectName: prototype.data.name,
    };
  };

export default setupPublicPrototype;
