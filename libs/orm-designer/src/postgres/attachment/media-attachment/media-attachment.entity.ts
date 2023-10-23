import { Entity, Enum, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { AttachmentType } from '../attachment-type.enum';
import { MediaDatatype } from './media-datatype.enum';

@Entity({ tableName: 'designer.media_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
export class MediaAttachmentEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<MediaAttachmentEntity>>({
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && { environmentID }),
    } as ResolvedForeignKeys<MediaAttachmentEntity, Data>;
  }

  @Property({ type: MarkupType })
  url: Markup;

  @Property()
  name: string;

  @Property()
  isAsset: boolean;

  @Enum(() => MediaDatatype)
  datatype: MediaDatatype;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<MediaAttachmentEntity>) {
    super(data);

    ({
      url: this.url,
      name: this.name,
      isAsset: this.isAsset,
      datatype: this.datatype,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = MediaAttachmentEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      type: AttachmentType.MEDIA as const,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
