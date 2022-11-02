import * as Base from '@platform/configs/base';
import { createMultiAdapter } from 'bidirectional-adapter';

import * as Project from '../../project';

export const simple = createMultiAdapter<Base.Adapters.Version.Session.DBSession, Base.Adapters.Version.Session.Session>(
  (session) => Base.Adapters.Version.Session.simple.fromDB(session, { defaultVoice: Project.CONFIG.voice.default }),
  (session) => Base.Adapters.Version.Session.simple.toDB(session, { defaultVoice: Project.CONFIG.voice.default })
);
