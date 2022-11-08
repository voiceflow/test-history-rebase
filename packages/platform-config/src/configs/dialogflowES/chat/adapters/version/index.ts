import * as Common from '@platform-config/configs/common';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Project from '../../project';
import * as Publishing from './publishing';
import * as Session from './session';
import * as Settings from './settings';

export { Publishing, Session, Settings };

export const simple = createMultiAdapter<DFESVersion.ChatVersion, Models.Version.Model>(
  (version) => ({
    ...Common.Chat.Adapters.Version.simple.fromDB(version, { globalVariables: Project.CONFIG.globalVariables }),
    status: version.platformData.status,
    session: Session.simple.fromDB(version.platformData.settings.session),
    settings: Settings.simple.fromDB(version.platformData.settings),
    publishing: Publishing.smart.fromDB(version.platformData.publishing),
  }),
  notImplementedAdapter.transformer
);
