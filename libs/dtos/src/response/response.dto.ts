import type { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const ResponseDTO = CMSTabularResourceDTO.extend({});

export type Response = z.infer<typeof ResponseDTO>;
