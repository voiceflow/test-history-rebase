import { Entity, Enum, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { MediaDatatype } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

@Entity({ tableName: 'designer.media_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
export class MediaAttachmentEntity extends PostgresCMSObjectEntity {
  @Property({ type: MarkupType })
  url!: Markup;

  @Property()
  name!: string;

  @Property()
  isAsset!: boolean;

  @Enum(() => MediaDatatype)
  datatype!: MediaDatatype;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyType]?: CMSCompositePK;
}
