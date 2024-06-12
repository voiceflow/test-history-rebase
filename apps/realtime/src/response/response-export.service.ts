import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  ResponseDiscriminatorObject,
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
      responseAttachments: json.responseAttachments.map((item) =>
        Utils.object.omit(item, ['assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseAttachments'],
      responseDiscriminators: json.responseDiscriminators.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ),
    };
  }
}
