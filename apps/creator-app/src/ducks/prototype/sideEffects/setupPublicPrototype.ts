import { BaseButton } from '@voiceflow/base-types';
import { ChatVersion } from '@voiceflow/chat-types';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import _constant from 'lodash/constant';

import client from '@/client';
import { PrototypeLayout } from '@/constants/prototype';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { updatePrototype } from '../actions';
import { PrototypeSettings } from '../types';
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

    const { platform, type: projectType } = Realtime.legacyPlatformToProjectType(prototype.platform, prototype.type);

    const rootDiagramID = prototype.context.stack?.[0].programID as string;
    const layout = (prototype?.settings.layout ?? Realtime.Utils.platform.getDefaultPrototypeLayout(projectType)) as PrototypeLayout;
    const buttonsOnly = !!prototype?.settings.buttonsOnly;

    const version = {
      id: versionID,
      creatorID: null as any,
      projectID: null as any,
      rootDiagramID,
      variables: [],
      settings: {} as any,
      session: {} as any,
      publishing: {} as any,
      status: null,
      folders: {},
      components: [],
    };

    dispatch(resetPrototype());
    dispatch.local(Realtime.version.crud.add({ workspaceID: '', projectID: '', key: versionID, value: version }));
    dispatch(updatePrototype({ muted: layout === PrototypeLayout.TEXT_DIALOG, platform, projectType }));
    dispatch(Session.setActiveVersionID(versionID));
    dispatch(Session.setActiveDiagramID(rootDiagramID));

    const savedMessageDelay = Realtime.Utils.typeGuards.isChatProjectType(projectType)
      ? ChatVersion.defaultMessageDelay({ durationMilliseconds: prototype?.data?.messageDelay?.durationMilliseconds }).durationMilliseconds
      : 0;

    return {
      ...prototype?.settings,
      globalMessageDelayMilliseconds: savedMessageDelay,
      plan: planData.plan as PlanType,
      layout,
      buttons: prototype?.settings.buttons as BaseButton.ButtonsLayout,
      locales: prototype.data.locales,
      platform,
      projectType,
      hasPassword: prototype?.settings.hasPassword ?? false,
      projectName: prototype.data.name,
      buttonsOnly,
    };
  };

export default setupPublicPrototype;
