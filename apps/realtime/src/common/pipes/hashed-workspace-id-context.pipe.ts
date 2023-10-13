import type { PipeTransform } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { Merge } from 'type-fest';

interface EncodedContext {
  workspaceID: string;
}

interface EncodedPayload {
  context: EncodedContext;
}

interface DecodedContext {
  workspaceID: number;
  hashedWorkspaceID: string;
}

export type HashedWorkspaceIDContextType<T extends EncodedPayload> = Merge<T, { context: Merge<T['context'], DecodedContext> }>;

@Injectable()
export class HashedWorkspaceIDContextPipe implements PipeTransform<EncodedPayload> {
  constructor(
    @Inject(HashedIDService)
    protected readonly hashedIDService: HashedIDService
  ) {}

  protected createError(_value: EncodedPayload) {
    return new NotFoundException();
  }

  protected decode(value: EncodedPayload): HashedWorkspaceIDContextType<EncodedPayload> {
    return {
      ...value,
      context: {
        ...value.context,
        workspaceID: this.hashedIDService.decodeWorkspaceID(value.context.workspaceID),
        hashedWorkspaceID: value.context.workspaceID,
      },
    };
  }

  transform(value: EncodedPayload): HashedWorkspaceIDContextType<EncodedPayload> {
    try {
      return this.decode(value);
    } catch {
      throw this.createError(value);
    }
  }
}
