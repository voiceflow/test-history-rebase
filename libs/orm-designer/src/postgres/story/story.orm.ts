import { PostgresCMSTabularORM } from '../common';
import { StoryEntity } from './story.entity';

export class StoryORM extends PostgresCMSTabularORM(StoryEntity) {}
