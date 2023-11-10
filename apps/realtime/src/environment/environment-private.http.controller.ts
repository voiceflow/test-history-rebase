import { Body, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { EntitySerializer } from '@/common';
import { ProjectSerializer } from '@/project/project.serializer';

import { CloneRequest } from './dtos/clone.request';
import { CloneResponse } from './dtos/clone.response';
import { PreparePrototypeResponse } from './dtos/prepare-prototype.response';
import { EnvironmentService } from './environment.service';

@Controller('private/environment')
@ApiTags('Private/Environment')
export class EnvironmentPrivateHTTPController {
  constructor(
    @Inject(EnvironmentService)
    private readonly service: EnvironmentService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  @Post(':environmentID/clone')
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiBody({ schema: CloneRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: CloneResponse })
  clone(@Param('environmentID') environmentID: string, @Body(new ZodValidationPipe(CloneRequest)) body: CloneRequest): Promise<CloneResponse> {
    return this.service.cloneOne({ ...body, sourceEnvironmentID: environmentID }).then((result) => ({
      version: this.entitySerializer.nullable(result.version),
      project: this.projectSerializer.nullable(result.project),
      intents: this.entitySerializer.iterable(result.intents),
      entities: this.entitySerializer.iterable(result.entities),
      diagrams: this.entitySerializer.iterable(result.diagrams),
      responses: this.entitySerializer.iterable(result.responses),
      functions: this.entitySerializer.iterable(result.functions),
      utterances: this.entitySerializer.iterable(result.utterances),
      functionPaths: this.entitySerializer.iterable(result.functionPaths),
      liveDiagramIDs: result.liveDiagramIDs,
      entityVariants: this.entitySerializer.iterable(result.entityVariants),
      responseVariants: this.entitySerializer.iterable(result.responseVariants),
      requiredEntities: this.entitySerializer.iterable(result.requiredEntities),
      functionVariables: this.entitySerializer.iterable(result.functionVariables),
      responseAttachments: this.entitySerializer.iterable(result.responseAttachments),
      responseDiscriminators: this.entitySerializer.iterable(result.responseDiscriminators),
    }));
  }

  @Post(':environmentID/prepare-prototype')
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: PreparePrototypeResponse })
  preparePrototype(@Param('environmentID') environmentID: string): Promise<PreparePrototypeResponse> {
    return this.service.preparePrototype(environmentID).then((result) => ({
      version: this.entitySerializer.nullable(result.version),
      project: this.projectSerializer.nullable(result.project),
      intents: this.entitySerializer.iterable(result.intents),
      entities: this.entitySerializer.iterable(result.entities),
      diagrams: this.entitySerializer.iterable(result.diagrams),
      responses: this.entitySerializer.iterable(result.responses),
      functions: this.entitySerializer.iterable(result.functions),
      utterances: this.entitySerializer.iterable(result.utterances),
      functionPaths: this.entitySerializer.iterable(result.functionPaths),
      liveDiagramIDs: result.liveDiagramIDs,
      entityVariants: this.entitySerializer.iterable(result.entityVariants),
      responseVariants: this.entitySerializer.iterable(result.responseVariants),
      requiredEntities: this.entitySerializer.iterable(result.requiredEntities),
      functionVariables: this.entitySerializer.iterable(result.functionVariables),
      responseAttachments: this.entitySerializer.iterable(result.responseAttachments),
      responseDiscriminators: this.entitySerializer.iterable(result.responseDiscriminators),
    }));
  }
}
