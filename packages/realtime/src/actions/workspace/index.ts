import { LoguxControlOptions } from '../../control';
import CreateWorkspaceControl from './create';
import LeaveWorkspaceControl from './leave';
import {
  AcceptInviteControl,
  AddMemberControl,
  CancelInviteControl,
  EjectMemberControl,
  RemoveWorkspaceMemberControl,
  ReplaceWorkspaceMembersControl,
  SendInviteControl,
  UpdateInviteControl,
} from './member';
import RemoveWorkspaceControl from './remove';
import UpdateWorkspaceImageControl from './updateImage';
import UpdateWorkspaceNameControl from './updateName';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildWorkspaceActionControls = (options: LoguxControlOptions) => ({
  createWorkspaceControl: new CreateWorkspaceControl(options),
  leaveWorkspaceControl: new LeaveWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),
  updateWorkspaceImageControl: new UpdateWorkspaceImageControl(options),
  updateWorkspaceNameControl: new UpdateWorkspaceNameControl(options),

  // workspace member
  acceptInviteControl: new AcceptInviteControl(options),
  addMemberControl: new AddMemberControl(options),
  cancelInviteControl: new CancelInviteControl(options),
  ejectMemberControl: new EjectMemberControl(options),
  removeWorkspaceMemberControl: new RemoveWorkspaceMemberControl(options),
  replaceWorkspaceMembersControl: new ReplaceWorkspaceMembersControl(options),
  sendInviteControl: new SendInviteControl(options),
  updateInviteControl: new UpdateInviteControl(options),
});

export default buildWorkspaceActionControls;

export type WorkspaceActionControlMap = ReturnType<typeof buildWorkspaceActionControls>;
