import { Injectable } from '@nestjs/common';
import type { ResponseMessage } from '@voiceflow/dtos';
import type { ResponseMessageObject } from '@voiceflow/orm-designer';
import { ResponseMessageJSONAdapter } from '@voiceflow/orm-designer';

import { BaseSerializer } from '@/common';

@Injectable()
export class ResponseMessageSerializer extends BaseSerializer<ResponseMessageObject, ResponseMessage> {
  constructor() {
    super();
  }

  serialize(data: ResponseMessageObject): ResponseMessage {
    return ResponseMessageJSONAdapter.fromDB(data);
  }

  iterable(data: ResponseMessageObject[]): ResponseMessage[] {
    return ResponseMessageJSONAdapter.mapFromDB(data);
  }
}
