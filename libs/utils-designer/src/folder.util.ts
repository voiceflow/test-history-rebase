import { FolderDTO } from '@voiceflow/dtos';

import { validatorZodFactory } from './validator/validator.util';

export const folderNameValidator = validatorZodFactory(FolderDTO.shape.name);
