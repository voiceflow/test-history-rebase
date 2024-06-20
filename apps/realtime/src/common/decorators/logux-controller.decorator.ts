import { applyDecorators, Controller } from '@nestjs/common';

import { InjectRequestContext } from './request-context.decorator';

export const LoguxController = () => applyDecorators(Controller(), InjectRequestContext());
