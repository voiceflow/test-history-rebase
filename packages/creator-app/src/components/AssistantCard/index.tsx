import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AssistantCard as BaseAssistantCard, Box, Button, Dropdown, Members, OverflowTippyTooltip, setRef, SvgIcon, UserData } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/project';
import { useLinkedState, useToggle } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import * as S from './styles';

interface CardProps {
  title?: string;
  status?: string;
  isHovered?: boolean;
  onClickCard?: () => void;
  onClickDesigner?: () => void;
  project: Realtime.AnyProject;
  members?: UserData[];
}

export const AssistantCard = ({ project, isHovered, onClickCard, onClickDesigner, status, members }: CardProps) => {
  const [active, toggleActive] = useToggle(false);
  const { icon, logo } = Platform.Config.getTypeConfig({ type: project.type, platform: project.platform });
  const { name: platformName } = Platform.Config.get(project.platform);

  const titleRef = React.useRef<EditableTextAPI | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(project?.name);

  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);

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
    <BaseAssistantCard
      isActive={active}
      icon={logo || icon.name}
      iconTooltip={{ content: platformName }}
      isHovered={isHovered}
      image={project.image ? <S.ProjectImage src={project.image} /> : <SvgIcon icon="systemImage" size={45} color="#393E42" />}
      action={
        <>
          {onClickCard && <S.StyledLink onClick={onClickCard} />}

          <Box.Flex zIndex={100} flexDirection="row">
            <Button onClick={onClickDesigner} variant={Button.Variant.PRIMARY} squareRadius>
              {!canEditProject ? 'View' : 'Designer'}
            </Button>

            {canEditProject && (
              <Box ml={8}>
                <Dropdown options={projectOptions} selfDismiss placement="bottom" onClose={() => toggleActive(false)}>
                  {({ ref, onToggle, isOpen }) => (
                    <Button
                      ref={ref}
                      onClick={Utils.functional.chainVoid(onToggle, toggleActive)}
                      variant={Button.Variant.WHITE}
                      squareRadius
                      isActive={isOpen}
                      icon="ellipsis"
                      iconProps={{ size: 15 }}
                    />
                  )}
                </Dropdown>
              </Box>
            )}
          </Box.Flex>
        </>
      }
      title={
        <OverflowTippyTooltip content={project?.name} overflow style={{ width: '100%' }}>
          {(ref) => (
            <S.Title
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
      }
      subtitle={
        <>
          {status}

          {members && (
            <S.MembersContainer>
              <Members.AvatarList members={members} flat small />
            </S.MembersContainer>
          )}
        </>
      }
    />
  );
};
