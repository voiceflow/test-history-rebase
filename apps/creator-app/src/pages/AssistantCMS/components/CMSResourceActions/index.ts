import { CMSResourceActions as CMSResourceActionsComponent } from './CMSResourceActions.components';
import { cmsResourceActionsButtonFactory } from './CMSResourceActionsButton/CMSResourceActionsButton.factory';
import { CMSResourceActionsButtonCreateFolder } from './CMSResourceActionsButtonCreateFolder.component';
import { CMSResourceActionsButtonDelete } from './CMSResourceActionsButtonDelete.component';
import { CMSResourceActionsButtonExport } from './CMSResourceActionsButtonExport.component';
import { CMSResourceActionsButtonMoveToFolder } from './CMSResourceActionsButtonMoveToFolder.component';

export const CMSResourceActions = Object.assign(CMSResourceActionsComponent, {
  Move: cmsResourceActionsButtonFactory({ label: 'Move...', iconName: 'MoveTo' }),
  Share: cmsResourceActionsButtonFactory({ label: 'Share...', iconName: 'Community' }),
  Export: CMSResourceActionsButtonExport,
  Delete: CMSResourceActionsButtonDelete,
  MoveToFolder: CMSResourceActionsButtonMoveToFolder,
  CreateFolder: CMSResourceActionsButtonCreateFolder,
});
