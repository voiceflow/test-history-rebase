import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  ResponseDiscriminatorObject,
  ResponseMessageObject,
  ResponseObject,
} from '@voiceflow/orm-designer';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import { ResponseRepository } from './response.repository';

@Injectable()
export class ResponseExportService {
  constructor(
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository
  ) {}

  prepareExportData(
    data: {
      responses: ResponseObject[];
      responseVariants: AnyResponseVariantObject[];
      responseMessages: ResponseMessageObject[];
      responseAttachments: AnyResponseAttachmentObject[];
      responseDiscriminators: ResponseDiscriminatorObject[];
    },
    { backup }: { backup?: boolean } = {}
  ): ResponseExportImportDataDTO {
    const json = this.repository.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      responses: json.responses.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      responseVariants: json.responseVariants.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseVariants'],
      responseMessages: json.responseMessages.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseMessages'],
      responseAttachments: json.responseAttachments.map((item) =>
        Utils.object.omit(item, ['assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseAttachments'],
      responseDiscriminators: json.responseDiscriminators.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ),
    };
  }
}
