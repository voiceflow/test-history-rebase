import { Utils } from '@voiceflow/common';
import { Assistant } from '@voiceflow/dtos';
import { UserRole } from '@voiceflow/internal';
import { HashedIDService, UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { createMock, DeepMocked } from '@voiceflow/test-common/vitest';

import { AssistantService } from '@/assistant/assistant.service';
import { ProjectListService } from '@/project-list/project-list.service';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionService } from '@/version/version.service';

import { ProjectService } from './project.service';
import { LegacyProjectSerializer } from './project-legacy/legacy-project.serializer';
import { ProjectMemberService } from './project-member/project-member.service';
import { GeneralClient } from './project-platform/client/general.client';
import { ProjectPlatformService } from './project-platform/project-platform.service';

const USER_ID = 123;
const WORKSPACE_ID = 456;
const HASHED_WORKSPACE_ID = 'hashed-workspace-id';
const PROJECT = {
  _id: 'project-id',
  teamID: HASHED_WORKSPACE_ID,
  name: 'project name',
  devVersion: 'dev-version-id',
} as Realtime.VoiceflowProject;
const ASSISTANT = {
  id: 'assistant-id',
} as Assistant;

describe('ProjectService', () => {
  let service: ProjectService;
  let orm: DeepMocked<ProjectORM>;
  let identityClient: DeepMocked<IdentityClient>;
  let logux: DeepMocked<LoguxService>;
  let version: DeepMocked<VersionService>;
  let hashedID: DeepMocked<HashedIDService>;
  let assistantService: DeepMocked<AssistantService>;
  let member: DeepMocked<ProjectMemberService>;
  let projectList: DeepMocked<ProjectListService>;
  let platformClient: DeepMocked<GeneralClient>;
  let platform: DeepMocked<ProjectPlatformService>;
  let unleash: DeepMocked<UnleashFeatureFlagService>;
  let variableState: DeepMocked<VariableStateService>;
  let legacyProjectSerializer: DeepMocked<LegacyProjectSerializer>;

  beforeEach(async () => {
    orm = createMock<ProjectORM>();
    identityClient = createMock<IdentityClient>();
    logux = createMock<LoguxService>();
    version = createMock<VersionService>();
    hashedID = createMock<HashedIDService>({
      encodeWorkspaceID: vi.fn().mockReturnValue(HASHED_WORKSPACE_ID),
    });
    assistantService = createMock<AssistantService>();
    member = createMock<ProjectMemberService>();
    projectList = createMock<ProjectListService>();
    platformClient = createMock<GeneralClient>();
    platform = createMock<ProjectPlatformService>({
      getClient: vi.fn().mockReturnValue({
        getByUserID: vi.fn().mockResolvedValue(platformClient),
      }),
    });
    unleash = createMock<UnleashFeatureFlagService>();
    variableState = createMock<VariableStateService>();
    legacyProjectSerializer = createMock<LegacyProjectSerializer>();

    service = new ProjectService(
      orm,
      identityClient,
      logux,
      version,
      hashedID,
      assistantService,
      member,
      projectList,
      platform,
      unleash,
      variableState,
      legacyProjectSerializer
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('#createAndBroadcast()', () => {
    const templateID = 'template-id';
    const listID = 'list-id';
    const data = { name: 'new project name' };
    const authMeta = { userID: USER_ID, clientID: 'client-id' };

    it('should create a new project without creating an assistant (legacy)', async () => {
      vi.mocked(Utils.id.cuid).mockReturnValue(listID);
      platformClient.duplicate.mockResolvedValue(PROJECT);
      unleash.isEnabled.mockReturnValue(false);
      projectList.acquireDefaultListIDAndBroadcast.mockResolvedValue(listID);

      const result = await service.createAndBroadcast(authMeta, {
        workspaceID: WORKSPACE_ID,
        templateID,
        data,
      });

      expect(result).toEqual(Realtime.Adapters.projectAdapter.fromDB(PROJECT, { members: [] }));
      expect(platformClient.duplicate).toBeCalledWith(templateID, { ...data, teamID: HASHED_WORKSPACE_ID });
      expect(hashedID.encodeWorkspaceID).toBeCalledWith(WORKSPACE_ID);
      expect(projectList.acquireDefaultListIDAndBroadcast).toBeCalledWith(authMeta, WORKSPACE_ID, undefined);
      expect(logux.processAs).toBeCalledWith(
        Realtime.project.crud.add({
          key: PROJECT._id,
          value: Realtime.Adapters.projectAdapter.fromDB(PROJECT, { members: [] }),
          workspaceID: HASHED_WORKSPACE_ID,
        }),
        authMeta
      );
      expect(logux.processAs).toBeCalledWith(
        Realtime.projectList.addProjectToList({ workspaceID: HASHED_WORKSPACE_ID, projectID: PROJECT._id, listID }),
        authMeta
      );
      expect(logux.processAs).toBeCalledTimes(2);
    });

    it('should create a new project and an assistant', async () => {
      assistantService.createOneForLegacyProject.mockResolvedValue(ASSISTANT);
      platformClient.duplicate.mockResolvedValue(PROJECT);
      unleash.isEnabled.mockReturnValue(true);

      await service.createAndBroadcast(authMeta, {
        workspaceID: WORKSPACE_ID,
        templateID,
        data,
      });

      expect(assistantService.createOneForLegacyProject).toBeCalledWith(PROJECT.teamID, PROJECT._id, {
        name: PROJECT.name,
        activePersonaID: null,
        activeEnvironmentID: PROJECT.devVersion,
      });
      expect(logux.processAs).toBeCalledWith(Actions.Assistant.Add({ data: ASSISTANT, context: { workspaceID: HASHED_WORKSPACE_ID } }), authMeta);
      expect(logux.processAs).toBeCalledTimes(3);
    });

    it('should fail when devVersion is missing from the project', async () => {
      platformClient.duplicate.mockResolvedValue({ ...PROJECT, devVersion: undefined });
      unleash.isEnabled.mockReturnValue(true);

      await expect(
        service.createAndBroadcast(authMeta, {
          workspaceID: WORKSPACE_ID,
          templateID,
          data,
        })
      ).rejects.toThrow('devVersion (environmentID) is missing');

      expect(assistantService.createOneForLegacyProject).not.toBeCalled();
    });

    it('should add multiple members during creation', async () => {
      const memberOne = { role: UserRole.VIEWER as const, creatorID: 100 };
      const memberTwo = { role: UserRole.EDITOR as const, creatorID: 200 };
      const members = [memberOne, memberTwo];
      platformClient.duplicate.mockResolvedValue(PROJECT);
      unleash.isEnabled.mockReturnValue(false);

      const result = await service.createAndBroadcast(authMeta, {
        workspaceID: WORKSPACE_ID,
        templateID,
        data,
        members,
      });

      expect(result.members).toEqual({
        allKeys: [String(memberOne.creatorID), String(memberTwo.creatorID)],
        byKey: {
          [memberOne.creatorID]: memberOne,
          [memberTwo.creatorID]: memberTwo,
        },
      });
      expect(member.addMany).toBeCalledWith(PROJECT._id, members);
    });
  });
});
