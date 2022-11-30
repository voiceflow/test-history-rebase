import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import { AssistantCard as AssistantCardComponent, AssistantCardProps, MenuTypes } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';

interface CardProps extends AssistantCardProps {
  projectType?: Platform.Constants.ProjectType;
  platformType?: Platform.Constants.PlatformType;
}

export const AssistantCard = ({
  platformType = Platform.Constants.PlatformType.VOICEFLOW,
  projectType = Platform.Constants.ProjectType.CHAT,
  ...props
}: CardProps) => {
  const accessModal = ModalsV2.useModal(ModalsV2.AssistantAccess);
  const { icon } = Platform.Config.get(platformType).types[projectType]!;

  const divider = { label: 'divider', divider: true };
  const rename = { label: 'Rename', onClick: () => {} };
  const duplicate = { label: 'Duplicate', onClick: () => {} };
  const download = { label: 'Download (.vf)', onClick: () => {} };
  const copy = { label: 'Copy clone link', onClick: () => {} };
  const convert = { label: 'Convert to domain', onClick: () => {} };
  const manage = { label: 'Manage access', onClick: () => accessModal.openVoid() };
  const settings = { label: 'Settings', onClick: () => {} };
  const deleteAssistant = { label: 'Delete', onClick: () => {} };

  const allOptions = [rename, duplicate, download, copy, convert, divider, manage, settings, divider, deleteAssistant];
  const editorOptions = [rename, duplicate, download, copy, convert, divider, settings, divider, deleteAssistant];
  const viewerOptions = undefined;

  const options: { [k in UserRole]?: Nullable<MenuTypes.OptionWithoutValue>[] } = {
    [UserRole.OWNER]: allOptions,
    [UserRole.ADMIN]: allOptions,
    [UserRole.EDITOR]: editorOptions,
    [UserRole.VIEWER]: viewerOptions,
  };
  return <AssistantCardComponent {...props} options={options[props.userRole || UserRole.VIEWER]} icon={icon.name} iconColor={icon.color} />;
};
