import { Inject, Injectable } from '@nestjs/common';
import { AttachmentType, MediaDatatype } from '@voiceflow/dtos';

import { AssistantService } from '@/assistant/assistant.service';
import { AnyAttachmentCreateData } from '@/attachment/attachment.interface';
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

    const payload: AnyAttachmentCreateData[] = [
      {
        url: [url],
        type: AttachmentType.MEDIA,
        name,
        isAsset: true,
        datatype: MediaDatatype.IMAGE,
      },
    ];

    const context = {
      assistantID,
      environmentID: assistant.activeEnvironmentID,
    };

    if (!clientID) {
      const result = await this.attachment.createManyAndSync(payload, { userID, context });

      return result.add.attachments[0];
    }

    const [attachment] = await this.attachment.createManyAndBroadcast(payload, { auth: { userID, clientID }, context });

    return attachment;
  }
}
