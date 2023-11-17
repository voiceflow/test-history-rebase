import { INestApplication } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { ProjectEntity, ToJSON } from '@voiceflow/orm-designer';
import { createMock } from '@voiceflow/test-common/vitest';
import supertest from 'supertest';
import { Merge } from 'type-fest';

import { createControllerTestModule, mockEncoding } from '@/test';
import { itShouldDecodeWorkspaceID } from '@/test/controller';

import { CreateProjectFixtureRequest } from './dtos/create-project-fixture.request';
import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';
import { ProjectPrivateHTTPController } from './project-private.http.controller';

const USER_ID = 123;
const WORKSPACE_ID = 456;
const HASHED_WORKSPACE_ID = 'hashed-workspace-id';

describe('ProjectPrivateHTTPController', () => {
  const projectService = createMock<ProjectService>();
  const projectSerializer = createMock<ProjectSerializer>();
  const hashedIDService = createMock<HashedIDService>();

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await createControllerTestModule(
      {
        controllers: [ProjectPrivateHTTPController],
        providers: [ProjectService, ProjectSerializer],
      },
      { hashedIDService }
    )
      .overrideProvider(ProjectService)
      .useValue(projectService)
      .overrideProvider(ProjectSerializer)
      .useValue(projectSerializer)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    mockEncoding(hashedIDService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /private/project', () => {
    const body = {
      userID: USER_ID,
      workspaceID: HASHED_WORKSPACE_ID,
      data: {
        project: { name: 'project name' },
        version: {},
        diagrams: {},
      },
    } as CreateProjectFixtureRequest;
    const project = { id: 'project-id', teamID: WORKSPACE_ID } as ProjectEntity;
    const request = () => supertest(app.getHttpServer()).post('/private/project');

    beforeEach(() => {
      hashedIDService.decodeWorkspaceID.mockReturnValue(WORKSPACE_ID);
    });

    itShouldDecodeWorkspaceID(hashedIDService, () => request().send(body));

    it('should return a 201 response with a valid request', async () => {
      const appProject = { id: 'project-id', teamID: HASHED_WORKSPACE_ID } as Merge<ToJSON<ProjectEntity>, { teamID: string }>;
      projectService.importJSON.mockResolvedValue({ project } as any);
      projectSerializer.nullable.mockReturnValue(appProject);

      await request().send(body).expect(201, appProject);

      expect(projectService.importJSON).toBeCalledWith({ ...body, workspaceID: WORKSPACE_ID });
      expect(hashedIDService.decodeWorkspaceID).toBeCalledWith(HASHED_WORKSPACE_ID);
      expect(projectSerializer.nullable).toBeCalledWith(project);
    });

    it('should throw 400 with an invalid request', async () => {
      await request().send({ userID: USER_ID }).expect(400);
      await request().expect(400);

      expect(projectService.importJSON).not.toBeCalled();
    });
  });
});
