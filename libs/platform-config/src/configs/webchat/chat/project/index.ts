import * as Base from '@platform-config/configs/base';
import * as Voiceflow from '@platform-config/configs/voiceflow';

export const CONFIG = Base.Project.extend({
  ...Voiceflow.Common.Project.CONFIG,

  name: 'Web Chat',
})(Base.Project.validate);

export type Config = typeof CONFIG;
