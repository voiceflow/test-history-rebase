import type { PipeTransform } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { Merge } from 'type-fest';

interface EncodedPayload {
  workspaceID: string;
}

interface DecodedPayload {
  workspaceID: number;
}

export type HashedWorkspaceIDPayloadType<T extends EncodedPayload> = Merge<T, DecodedPayload>;

@Injectable()
export class HashedWorkspaceIDPayloadPipe implements PipeTransform<EncodedPayload> {
  constructor(@Inject(HashedIDService) protected readonly hashedIDService: HashedIDService) {}

  protected createError(_value: EncodedPayload) {
    return new NotFoundException();
  }

  protected decode(value: EncodedPayload): HashedWorkspaceIDPayloadType<EncodedPayload> {
    return {
      ...value,
      workspaceID: this.hashedIDService.decodeWorkspaceID(value.workspaceID),
    };
  }

  transform(value: EncodedPayload): HashedWorkspaceIDPayloadType<EncodedPayload> {
    try {
      return this.decode(value);
    } catch {
      throw this.createError(value);
    }
  }
}
