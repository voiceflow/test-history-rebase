import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AssistantCard as AssistantCardComponent, AssistantCardProps, OverflowTippyTooltip, setRef, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import * as Project from '@/ducks/project';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import { Title } from './styles';

interface CardProps extends AssistantCardProps {
  project: Realtime.AnyProject;
}

export const AssistantCard = ({ project, ...props }: CardProps) => {
  const { icon } = Platform.Config.getTypeConfig({ type: project.type, platform: project.platform });
  const { name: platformName } = Platform.Config.get(project.platform);
  const titleRef = React.useRef<EditableTextAPI | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(project?.name);

  const saveProjectName = useDispatch(Project.updateProjectNameByID, project?.id || '');

  const onRename = () => {
    titleRef.current?.startEditing();
    setIsEditing(true);
  };

  const onBlur = () => {
    titleRef.current?.stopEditing();

    updateFormValue(formatProjectName(formValue || ''));
    saveProjectName(formatProjectName(formValue || ''));

    setIsEditing(false);
  };

  const projectOptions = useProjectOptions({
    onRename,
    projectID: project?.id,
    versionID: project?.versionID,
    withConvertToDomain: true,
    withInvite: true,
    v2: true,
  });

  return (
    <AssistantCardComponent
      {...props}
      icon={icon.name}
      iconTitle={platformName}
      options={props.userRole === UserRole.VIEWER ? undefined : projectOptions}
      iconColor={icon.color}
      hasTitleComponent
    >
      <OverflowTippyTooltip content={project?.name} overflow>
        {(ref) => (
          <Title
            ref={(editableText) => {
              titleRef.current = editableText;
              setRef(ref, editableText?.titleRef?.current);
            }}
            value={formValue || ''}
            onBlur={onBlur}
            readOnly={!isEditing}
            onChange={updateFormValue}
            onKeyPress={withEnterPress(withInputBlur())}
          />
        )}
      </OverflowTippyTooltip>
    </AssistantCardComponent>
  );
};
