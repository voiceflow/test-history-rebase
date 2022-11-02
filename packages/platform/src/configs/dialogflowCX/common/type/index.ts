import * as Base from '@platform/configs/base';
import { Types } from '@platform/utils';

export const CONFIG = Types.partialSatisfies<Base.Type.Common.Config>()({
  icon: {
    name: 'dialogflowCX',
    color: '#669DF6',
  },
});
