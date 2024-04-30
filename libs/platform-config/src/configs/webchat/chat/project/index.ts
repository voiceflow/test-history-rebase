import * as Base from '@/configs/base';
import * as Voiceflow from '@/configs/voiceflow';

export const CONFIG = Base.Project.extend({
  ...Voiceflow.Common.Project.CONFIG,

  name: 'Web Chat',
})(Base.Project.validate);

export type Config = typeof CONFIG;
