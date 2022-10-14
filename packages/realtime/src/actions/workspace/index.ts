import { LoguxControlOptions } from '../../control';
import AddWorkspaceControl from './add';
import CheckoutWorkspaceControl from './checkout';
import CreateWorkspaceControl from './create';
import LeaveWorkspaceControl from './leave';
import {
  AcceptInviteControl,
  AddMemberControl,
  CancelInviteControl,
  EjectMemberControl,
  PatchWorkspaceMemberControl,
  RemoveWorkspaceMemberControl,
  ReplaceWorkspaceMembersControl,
  SendInviteControl,
  UpdateInviteControl,
} from './member';
import RemoveWorkspaceControl from './remove';
import UpdateWorkspaceImageControl from './updateImage';
import UpdateWorkspaceNameControl from './updateName';

const buildWorkspaceActionControls = (options: LoguxControlOptions) => ({
  addWorkspaceControl: new AddWorkspaceControl(options),
  createWorkspaceControl: new CreateWorkspaceControl(options),
  checkoutWorkspaceControl: new CheckoutWorkspaceControl(options),
  leaveWorkspaceControl: new LeaveWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),
  updateWorkspaceImageControl: new UpdateWorkspaceImageControl(options),
  updateWorkspaceNameControl: new UpdateWorkspaceNameControl(options),

  // workspace member
  acceptInviteControl: new AcceptInviteControl(options),
  addMemberControl: new AddMemberControl(options),
  cancelInviteControl: new CancelInviteControl(options),
  ejectMemberControl: new EjectMemberControl(options),
  patchWorkspaceMemberControl: new PatchWorkspaceMemberControl(options),
  removeWorkspaceMemberControl: new RemoveWorkspaceMemberControl(options),
  replaceWorkspaceMembersControl: new ReplaceWorkspaceMembersControl(options),
  sendInviteControl: new SendInviteControl(options),
  updateInviteControl: new UpdateInviteControl(options),
});

export default buildWorkspaceActionControls;
