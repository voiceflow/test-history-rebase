import type * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

export const CONFIG = ConfigUtils.partialSatisfies<Base.Type.Common.Config>()({
  name: 'Dialogflow ES',

  icon: {
    name: 'dialogflow',
    color: '#FF9800',
  },

  logo: 'logoDialogflow',
});
