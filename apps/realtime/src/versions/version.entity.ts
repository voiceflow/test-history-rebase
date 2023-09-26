import { Entity } from '@mikro-orm/core';
import { MongoObjectEntity } from '@voiceflow/orm-designer';

@Entity({ collection: 'versions' })
export class VersionEntity extends MongoObjectEntity {}
