import { Button } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { PlanType } from '@voiceflow/internal';
import _constant from 'lodash/constant';
import { batch } from 'react-redux';

import client from '@/client';
import * as Session from '@/ducks/session';
import { addVersion } from '@/ducks/version/actions';
import { AnyLocale } from '@/ducks/version/types';
import { Thunk } from '@/store/types';

import { updatePrototype } from '../actions';
import { PrototypeLayout, PrototypeSettings } from '../types';
import resetPrototype from './reset';

const setupPublicPrototype =
  (versionID: string): Thunk<PrototypeSettings> =>
  async (dispatch) => {
    const [prototype, planData] = await Promise.all([
      client.api.version.getPrototype(versionID).catch(_constant(null)),
      client.api.version.getPrototypePlan(versionID).catch(_constant(null)),
    ] as const);

    if (!prototype) {
      throw new Error("Prototype doesn't exist");
    }

    if (!planData?.plan) {
      throw new Error('Could not retrieve permissions for prototype share');
    }

    const rootDiagramID = prototype.context.stack?.[0].programID as string;
    const layout = (prototype?.settings.layout ?? PrototypeLayout.TEXT_DIALOG) as PrototypeLayout;

    batch(() => {
      dispatch(resetPrototype());
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
      dispatch(updatePrototype({ muted: layout === PrototypeLayout.TEXT_DIALOG }));
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveDiagramID(rootDiagramID));
    });

    return {
      ...prototype?.settings,
      plan: planData.plan as PlanType,
      layout,
      buttons: prototype?.settings.buttons as Button.ButtonsLayout,
      locales: prototype.data.locales as AnyLocale[],
      platform: prototype.platform as Constants.PlatformType,
      hasPassword: prototype?.settings.hasPassword ?? false,
      projectName: prototype.data.name,
    };
  };

export default setupPublicPrototype;
