import * as Base from '@platform-config/configs/base';
import { Types } from '@platform-config/utils';

export const CONFIG = Types.partialSatisfies<Base.Type.Common.Config>()({
  icon: {
    name: 'dialogflowCX',
    color: '#669DF6',
  },
});
