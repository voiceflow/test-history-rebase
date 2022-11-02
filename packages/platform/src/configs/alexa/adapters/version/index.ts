import * as Base from '@platform/configs/base';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Project from '../../project';
import * as Session from './session';

export { Session };

export const simple = createMultiAdapter<AlexaVersion.Version, Models.Version.Model>(
  ({
    platformData: {
      status,
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...Base.Adapters.Version.simple.fromDB(baseVersion, { globalVariables: Project.CONFIG.globalVariables }),

    status,
    session: Session.simple.fromDB(session),
    settings: Utils.object.omit(AlexaVersion.defaultSettings(settings), ['session']),
    publishing: AlexaVersion.defaultPublishing(publishing),
  }),
  notImplementedAdapter.transformer
);
