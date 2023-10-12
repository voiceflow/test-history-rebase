import { PostgresCMSTabularORM } from '@/postgres/common';

import { PromptEntity } from './prompt.entity';

export class PromptORM extends PostgresCMSTabularORM(PromptEntity) {}
