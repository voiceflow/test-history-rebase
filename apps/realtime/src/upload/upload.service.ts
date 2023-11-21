import { Inject, Injectable } from '@nestjs/common';
import { AnyAttachmentEntity, AttachmentType, MediaDatatype } from '@voiceflow/orm-designer';

import { AssistantService } from '@/assistant/assistant.service';
import { AttachmentCreateData } from '@/attachment/attachment.interface';
import { AttachmentService } from '@/attachment/attachment.service';

@Injectable()
export class UploadService {
  constructor(
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(AssistantService)
    private readonly assistant: AssistantService
  ) {}

  async createImageAttachment({
    url,
    name,
    userID,
    clientID,
    assistantID,
  }: {
    url: string;
    name: string;
    userID: number;
    clientID?: string;
    assistantID: string;
  }) {
    const assistant = await this.assistant.findOneOrFail(assistantID);

    let attachment: AnyAttachmentEntity;

    const payload: AttachmentCreateData[] = [
      {
        url: [url],
        type: AttachmentType.MEDIA,
        name,
        isAsset: true,
        datatype: MediaDatatype.IMAGE,
        assistantID,
        environmentID: assistant.activeEnvironmentID,
      },
    ];

    if (!clientID) {
      const result = await this.attachment.createManyAndSync(payload);

      [attachment] = result.add.attachments;
    } else {
      [attachment] = await this.attachment.createManyAndBroadcast({ userID, clientID }, payload);
    }

    return attachment;
  }
}
