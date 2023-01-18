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
import { LoadAllQuotasControl, RefreshQuotaDetails, ReplaceQuotaControl } from './quotas';
import RemoveWorkspaceControl from './remove';
import { PatchWorkspaceSettingsControl, ReplaceWorkspaceSettingsControl } from './settings';
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
  addMemberControl: new AddMemberControl(options),
  sendInviteControl: new SendInviteControl(options),
  ejectMemberControl: new EjectMemberControl(options),
  updateInviteControl: new UpdateInviteControl(options),
  acceptInviteControl: new AcceptInviteControl(options),
  cancelInviteControl: new CancelInviteControl(options),
  patchWorkspaceMemberControl: new PatchWorkspaceMemberControl(options),
  removeWorkspaceMemberControl: new RemoveWorkspaceMemberControl(options),
  replaceWorkspaceMembersControl: new ReplaceWorkspaceMembersControl(options),

  // workspace quotas
  loadAllQuotasControl: new LoadAllQuotasControl(options),
  replaceQuotaControl: new ReplaceQuotaControl(options),

  // workspace settings
  patchWorkspaceSettingsControl: new PatchWorkspaceSettingsControl(options),
  replaceWorkspaceSettingsControl: new ReplaceWorkspaceSettingsControl(options),
  refreshWorkspaceQuotaDetailsControl: new RefreshQuotaDetails(options),
});

export default buildWorkspaceActionControls;
