import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AssistantCard as AssistantCardComponent, AssistantCardProps, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import * as Project from '@/ducks/project';
import { useDispatch, useLinkedState, useProjectOptions } from '@/hooks';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import { Title } from './styles';

interface CardProps extends AssistantCardProps {
  projectType?: Platform.Constants.ProjectType;
  platformType?: Platform.Constants.PlatformType;
  project?: Realtime.AnyProject;
}

export const AssistantCard = ({
  platformType = Platform.Constants.PlatformType.VOICEFLOW,
  projectType = Platform.Constants.ProjectType.CHAT,
  project,
  ...props
}: CardProps) => {
  const { icon } = Platform.Config.get(platformType).types[projectType]!;
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
    projectName: project?.name,
    withConvertToDomain: true,
    withInvite: true,
    v2: true,
  });

  return (
    <AssistantCardComponent
      {...props}
      options={props.userRole === UserRole.VIEWER ? undefined : projectOptions}
      icon={icon.name}
      iconColor={icon.color}
      hasTitleComponent
    >
      <OverflowTippyTooltip title={project?.name} overflow>
        {(ref) => (
          <Title
            ref={(editableText) => {
              titleRef.current = editableText;

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref.current = editableText?.titleRef?.current;
            }}
            readOnly={!isEditing}
            value={formValue || ''}
            onBlur={onBlur}
            onChange={updateFormValue}
            onKeyPress={withEnterPress(withInputBlur())}
          />
        )}
      </OverflowTippyTooltip>
    </AssistantCardComponent>
  );
};
