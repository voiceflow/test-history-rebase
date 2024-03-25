import { PostgresCMSTabularORM } from '../common';
import { StoryEntity } from './story.entity';
import { StoryJSONAdapter } from './story-json.adapter';

export class StoryORM extends PostgresCMSTabularORM<StoryEntity> {
  Entity = StoryEntity;

  jsonAdapter = StoryJSONAdapter;
}
