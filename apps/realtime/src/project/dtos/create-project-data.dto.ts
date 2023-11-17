import { ProjectDTO } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config/backend';
import { z } from 'nestjs-zod/z';

const CreateProjectData = ProjectDTO.pick({
  name: true,
  image: true,
  _version: true,
})
  .extend({
    platform: z.nativeEnum(Platform.Constants.PlatformType),
  })
  .partial();

export type CreateProjectData = z.infer<typeof CreateProjectData>;
