/* eslint-disable sonarjs/no-duplicate-string, mocha/no-identical-title */
import { PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';

import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as WorkspaceV1 from '@/ducks/workspace';
import * as Workspace from '@/ducks/workspaceV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const CREATOR_ID = 999;
const EMAIL = 'creator@voiceflow.com';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID };

const WORKSPACE_MEMBER = {
  name: 'creator',
  image: 'http://example.com/avatar.png',
  creator_id: CREATOR_ID,
  role: UserRole.ADMIN,
  seats: 3,
  email: EMAIL,
  created: '',
  status: null,
};

const WORKSPACE: Realtime.Workspace = {
  id: WORKSPACE_ID,
  creatorID: CREATOR_ID,
  name: 'workspace',
  created: '',
  image: 'http://example.com/image.png',
  hasSource: false,
  templates: false,
  betaFlag: -1,
  projects: 3,
  seats: 5,
  plan: PlanType.PRO,
  organizationID: null,
  state: null,
  seatLimits: { viewer: 10, editor: 20 },
  boards: [],
  members: [
    WORKSPACE_MEMBER,
    {
      name: 'view only creator',
      image: 'http://example.com/avatar.png',
      creator_id: 1000,
      role: UserRole.VIEWER,
      seats: 3,
      email: 'viewer@voiceflow.com',
      created: '',
      status: null,
    },
  ],
};

const MOCK_STATE: Workspace.WorkspaceState = {
  byKey: {
    [WORKSPACE_ID]: WORKSPACE,
    abc: {
      id: 'abc',
      creatorID: 1000,
      name: 'alphabet workspace',
      organizationID: null,
      state: null,
      created: '',
      image: 'http://example.com/image.png',
      hasSource: false,
      templates: false,
      betaFlag: -1,
      projects: 3,
      seats: 5,
      plan: PlanType.PRO,
      seatLimits: { viewer: 10, editor: 20 },
      boards: [],
      members: [],
    },
  },
  allKeys: [WORKSPACE_ID, 'abc'],
};

suite(Workspace, MOCK_STATE)('Ducks - Workspace V2', ({ expect, describeReducerV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Workspace.INITIAL_STATE);

    describeReducerV2(Realtime.workspace.member.add, ({ applyAction }) => {
      const creatorID = 500;
      const member = { ...WORKSPACE_MEMBER, name: 'new member', email: 'new.member@voiceflow.com', creator_id: creatorID };

      it('add a new workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID, member });

        expect(result.byKey[WORKSPACE_ID].members).to.eql([...WORKSPACE.members, member]);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', creatorID, member });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.remove, ({ applyAction }) => {
      it('remove an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1000 });

        expect(result.byKey[WORKSPACE_ID].members).to.eql([WORKSPACE_MEMBER]);
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1001 });

        expect(result.byKey[WORKSPACE_ID].members).to.eql(WORKSPACE.members);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', creatorID: CREATOR_ID });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.cancelInvite, ({ applyAction }) => {
      it('cancel the invite of an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'viewer@voiceflow.com' });

        expect(result.byKey[WORKSPACE_ID].members).to.eql([WORKSPACE_MEMBER]);
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'foo@bar.com' });

        expect(result.byKey[WORKSPACE_ID].members).to.eql(WORKSPACE.members);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', email: EMAIL });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.patch, ({ applyAction }) => {
      const member = { role: UserRole.BILLING };

      it('patch an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: CREATOR_ID, member });

        expect(result.byKey[WORKSPACE_ID].members[0]).to.eql({ ...WORKSPACE_MEMBER, role: UserRole.BILLING });
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1001, member });

        expect(result).to.eq(MOCK_STATE);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', creatorID: CREATOR_ID, member });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.updateInvite, ({ applyAction }) => {
      it('patch an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: EMAIL, role: UserRole.BILLING });

        expect(result.byKey[WORKSPACE_ID].members[0]).to.containSubset({ role: UserRole.BILLING });
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'foo@bar.com', role: UserRole.BILLING });

        expect(result).to.eq(MOCK_STATE);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', email: EMAIL, role: UserRole.BILLING });

        expect(result).to.eq(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

    describe('allWorkspacesSelector()', () => {
      it('select all workspaces from the legacy store', () => {
        const workspaces = generate.array(3, () => ({ id: generate.id() }));

        const result = Workspace.allWorkspacesSelector(
          createState(MOCK_STATE, { [WorkspaceV1.STATE_KEY]: Realtime.Utils.normalized.normalize(workspaces) })
        );

        expect(result).to.eql(workspaces);
      });

      it('select all workspaces', () => {
        const result = Workspace.allWorkspacesSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([WORKSPACE, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allWorkspaceIDsSelector()', () => {
      it('select all workspace IDs from the legacy store', () => {
        const workspaces = generate.array(3, () => ({ id: generate.id() }));

        const result = Workspace.allWorkspaceIDsSelector(
          createState(MOCK_STATE, { [WorkspaceV1.STATE_KEY]: Realtime.Utils.normalized.normalize(workspaces) })
        );

        expect(result).to.eql(workspaces.map((workspace) => workspace.id));
      });

      it('select all workspace IDs', () => {
        const result = Workspace.allWorkspaceIDsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.allKeys);
      });
    });

    describe('hasTemplatesWorkspaceSelector()', () => {
      it('true if a templates workspace exists', () => {
        const workspaceState = { ...MOCK_STATE, byKey: { ...MOCK_STATE.byKey, [WORKSPACE_ID]: { ...WORKSPACE, templates: true } } };

        const result = Workspace.hasTemplatesWorkspaceSelector(createState(workspaceState, v2FeatureState));

        expect(result).to.be.true;
      });

      it('false if a templates workspace does not exists', () => {
        const result = Workspace.hasTemplatesWorkspaceSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.be.false;
      });
    });

    describe('personalWorkspaceIDsSelector()', () => {
      it('select all non-templates workspaces', () => {
        const workspaceState = { ...MOCK_STATE, byKey: { ...MOCK_STATE.byKey, [WORKSPACE_ID]: { ...WORKSPACE, templates: true } } };

        const result = Workspace.personalWorkspaceIDsSelector(createState(workspaceState, v2FeatureState));

        expect(result).to.eql(['abc']);
      });
    });

    describe('workspaceByIDSelector()', () => {
      it('select workspace from the legacy store', () => {
        const workspace = { id: WORKSPACE_ID };
        const workspaceState = Realtime.Utils.normalized.normalize([workspace]);

        const result = Workspace.workspaceByIDSelector(createState(MOCK_STATE, { [WorkspaceV1.STATE_KEY]: workspaceState }), { id: WORKSPACE_ID });

        expect(result).to.eq(workspace);
      });

      it('select known workspace', () => {
        const result = Workspace.workspaceByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: WORKSPACE_ID });

        expect(result).to.eq(WORKSPACE);
      });

      it('select unknown workspace', () => {
        const result = Workspace.workspaceByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getWorkspaceByIDSelector()', () => {
      it('select workspace from the legacy store', () => {
        const workspace = { id: WORKSPACE_ID };
        const workspaceState = Realtime.Utils.normalized.normalize([workspace]);

        const result = Workspace.getWorkspaceByIDSelector(createState(MOCK_STATE, { [WorkspaceV1.STATE_KEY]: workspaceState }))(WORKSPACE_ID);

        expect(result).to.eq(workspace);
      });

      it('select known workspace', () => {
        const result = Workspace.getWorkspaceByIDSelector(createState(MOCK_STATE, v2FeatureState))(WORKSPACE_ID);

        expect(result).to.eq(WORKSPACE);
      });

      it('select unknown workspace', () => {
        const result = Workspace.getWorkspaceByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });

    describe('isAdminOfAnyWorkspaceSelector()', () => {
      it('true if member with admin role matches active user', () => {
        const rootState = { ...v2FeatureState, [Account.STATE_KEY]: { creator_id: CREATOR_ID } };

        const result = Workspace.isAdminOfAnyWorkspaceSelector(createState(MOCK_STATE, rootState));

        expect(result).to.be.true;
      });

      it('false if user is not admin of workspaces they are a member of', () => {
        const rootState = { ...v2FeatureState, [Account.STATE_KEY]: { creator_id: 1000 } };

        const result = Workspace.isAdminOfAnyWorkspaceSelector(createState(MOCK_STATE, rootState));

        expect(result).to.be.false;
      });

      it('false if no member exists that matches active user', () => {
        const rootState = { ...v2FeatureState, [Account.STATE_KEY]: { creator_id: 1001 } };

        const result = Workspace.isAdminOfAnyWorkspaceSelector(createState(MOCK_STATE, rootState));

        expect(result).to.be.false;
      });
    });
  });
});
