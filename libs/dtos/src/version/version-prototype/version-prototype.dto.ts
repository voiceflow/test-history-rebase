import { z } from 'zod';

import { PrototypeModelDTO } from '@/common';

import { VersionPrototypeContextDTO } from './version-prototype-context.dto';
import { VersionPrototypeDataDTO } from './version-prototype-data.dto';
import { VersionPrototypeSettingsDTO } from './version-prototype-settings.dto';
import { VersionPrototypeSurveyorContextDTO } from './version-prototype-surveyor-context.dto';

export const VersionPrototypeDTO = z
  .object({
    type: z.string(),
    data: VersionPrototypeDataDTO,
    model: PrototypeModelDTO,
    context: VersionPrototypeContextDTO,
    platform: z.string(),
    settings: VersionPrototypeSettingsDTO,
    surveyorContext: VersionPrototypeSurveyorContextDTO,
  })
  .passthrough();

export type VersionPrototype = z.infer<typeof VersionPrototypeDTO>;
