import * as Base from '@platform-config/configs/base';
import { Types } from '@platform-config/utils';

export const CONFIG = Types.partialSatisfies<Base.Type.Common.Config>()({
  name: 'Dialogflow ES',

  icon: {
    name: 'dialogflow',
    color: '#FF9800',
  },

  logo: 'logoDialogflow',
});
