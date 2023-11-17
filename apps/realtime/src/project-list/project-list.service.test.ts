import { Utils } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { WorkspaceProjectListsORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMock, DeepMocked } from '@voiceflow/test-common/vitest';

import { ProjectListService } from './project-list.service';

const WORKSPACE_ID = 456;
const HASHED_WORKSPACE_ID = 'hashed-workspace-id';
const PROJECT_LIST = {
  board_id: 'project-list-id',
} as Realtime.DBProjectList;

describe('ProjectListService', () => {
  let service: ProjectListService;
  let orm: DeepMocked<WorkspaceProjectListsORM>;
  let logux: DeepMocked<LoguxService>;
  let hashedID: DeepMocked<HashedIDService>;

  beforeEach(async () => {
    orm = createMock<WorkspaceProjectListsORM>();
    logux = createMock<LoguxService>();
    hashedID = createMock<HashedIDService>({
      encodeWorkspaceID: vi.fn().mockReturnValue(HASHED_WORKSPACE_ID),
    });

    service = new ProjectListService(orm, logux, hashedID);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('#acquireDefaultListIDAndBroadcast()', () => {
    const authMeta = {
      userID: 123,
      clientID: 'client-id',
    };

    it('should use the provided override list ID', async () => {
      const overrideListID = 'override-list-id';

      const result = await service.acquireDefaultListIDAndBroadcast(authMeta, WORKSPACE_ID, overrideListID);

      expect(result).toBe(overrideListID);
    });

    it('should look up the default list ID', async () => {
      service.getDefaultList = vi.fn().mockResolvedValue(PROJECT_LIST);

      const result = await service.acquireDefaultListIDAndBroadcast(authMeta, WORKSPACE_ID);

      expect(result).toBe(PROJECT_LIST.board_id);
    });

    it('should emit a "project_list:ADD" action and return the ID', async () => {
      const newListID = 'new-list-id';
      vi.mocked(Utils.id.cuid).mockReturnValue(newListID);
      service.getDefaultList = vi.fn().mockResolvedValue(null);

      const result = await service.acquireDefaultListIDAndBroadcast(authMeta, WORKSPACE_ID);

      expect(result).toBe(newListID);
      expect(logux.processAs).toBeCalledWith(
        Realtime.projectList.crud.add({
          key: newListID,
          value: { id: newListID, name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [] },
          workspaceID: HASHED_WORKSPACE_ID,
        }),
        authMeta
      );
      expect(hashedID.encodeWorkspaceID).toBeCalledWith(WORKSPACE_ID);
    });
  });
});
