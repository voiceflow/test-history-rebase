import { BaseButton } from '@voiceflow/base-types';
import { ChatVersion } from '@voiceflow/chat-types';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _constant from 'lodash/constant';
import { batch } from 'react-redux';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as VersionActions from '@/ducks/version/actions';
import { Thunk } from '@/store/types';

import { updatePrototype } from '../actions';
import { PrototypeLayout, PrototypeSettings } from '../types';
import resetPrototype from './reset';

const setupPublicPrototype =
  (versionID: string): Thunk<PrototypeSettings> =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

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
    const version = {
      id: versionID,
      creatorID: null as any,
      projectID: null as any,
      rootDiagramID,
      variables: [],
      settings: {} as any,
      session: {} as any,
      publishing: {},
      status: null,
      folders: {},
      topics: [],
      components: [],
    };

    batch(() => {
      dispatch(resetPrototype());
      if (isAtomicActions) {
        // passing empty params since this will only be evaluated locally
        dispatch.local(Realtime.version.crud.add({ workspaceID: '', projectID: '', key: versionID, value: version }));
      } else {
        dispatch(VersionActions.crud.add(versionID, version));
      }

      dispatch(updatePrototype({ muted: layout === PrototypeLayout.TEXT_DIALOG }));
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveDiagramID(rootDiagramID));
    });
    const savedMessageDelay = Realtime.Utils.typeGuards.isChatPlatform(prototype.platform)
      ? ChatVersion.defaultMessageDelay({ durationMilliseconds: prototype?.data?.messageDelay?.durationMilliseconds }).durationMilliseconds
      : 0;

    return {
      ...prototype?.settings,
      globalMessageDelayMilliseconds: savedMessageDelay,
      plan: planData.plan as PlanType,
      layout,
      buttons: prototype?.settings.buttons as BaseButton.ButtonsLayout,
      locales: prototype.data.locales as Realtime.AnyLocale[],
      platform: prototype.platform as VoiceflowConstants.PlatformType,
      hasPassword: prototype?.settings.hasPassword ?? false,
      projectName: prototype.data.name,
    };
  };

export default setupPublicPrototype;
