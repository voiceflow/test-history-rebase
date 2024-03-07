import { Entity, Enum, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { AttachmentType, MediaDatatype } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { MediaAttachmentEntityAdapter } from './media-attachment-entity.adapter';

@Entity({ tableName: 'designer.media_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
export class MediaAttachmentEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<MediaAttachmentEntity>>>(data: JSON) {
    return MediaAttachmentEntityAdapter.toDB<JSON>(data);
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
    } = MediaAttachmentEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<MediaAttachmentEntity & { type: typeof AttachmentType.MEDIA }> {
    return {
      type: AttachmentType.MEDIA,

      ...MediaAttachmentEntityAdapter.fromDB({
        ...wrap<MediaAttachmentEntity>(this).toObject(...args),
        updatedBy: this.updatedBy,
        assistant: this.assistant,
      }),
    };
  }
}
