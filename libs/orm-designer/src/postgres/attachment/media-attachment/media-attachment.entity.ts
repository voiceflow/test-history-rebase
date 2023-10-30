import { Entity, Enum, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { AttachmentType } from '../attachment-type.enum';
import { MediaAttachmentJSONAdapter } from './media-attachment.adapter';
import { MediaDatatype } from './media-datatype.enum';

@Entity({ tableName: 'designer.media_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
export class MediaAttachmentEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<MediaAttachmentEntity>>>(data: JSON) {
    return MediaAttachmentJSONAdapter.toDB<JSON>(data);
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

  toJSON(): ToJSONWithForeignKeys<MediaAttachmentEntity & { type: AttachmentType.MEDIA }> {
    return {
      type: AttachmentType.MEDIA,

      ...MediaAttachmentJSONAdapter.fromDB({
        ...this.wrap<MediaAttachmentEntity>(),
        assistant: this.assistant,
      }),
    };
  }
}
