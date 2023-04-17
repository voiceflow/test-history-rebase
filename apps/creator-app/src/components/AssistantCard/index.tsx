import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import {
  AssistantCard as BaseAssistantCard,
  Box,
  Button,
  Dropdown,
  Members,
  OverflowTippyTooltip,
  setRef,
  stopPropagation,
  SvgIcon,
  TippyTooltip,
  UserData,
} from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/project';
import { useLinkedState, useToggle } from '@/hooks';
import { useIsLockedProjectViewer, usePermission } from '@/hooks/permission';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { usePaymentModal } from '@/ModalsV2/hooks';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import * as S from './styles';

interface CardProps {
  title?: string;
  status?: string;
  project: Realtime.AnyProject;
  members?: UserData[];
  isHovered?: boolean;
  onClickCard?: VoidFunction;
  onClickDesigner?: VoidFunction;
}

export const AssistantCard = ({ project, isHovered, onClickCard, onClickDesigner, status, members }: CardProps) => {
  const { icon, logo } = Platform.Config.getTypeConfig({ type: project.type, platform: project.platform });
  const { name: platformName } = Platform.Config.get(project.platform);

  const titleRef = React.useRef<EditableTextAPI | null>(null);

  const [active, toggleActive] = useToggle(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(project?.name);

  const editProject = usePermission(Permission.PROJECT_EDIT);
  const paymentModal = usePaymentModal();
  const isLockedProjectViewer = useIsLockedProjectViewer();

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
    withInvite: true,
    withConvertToDomain: true,
  });

  return (
    <BaseAssistantCard
      icon={isLockedProjectViewer ? 'lockLocked' : logo || icon.name}
      image={project.image ? <BaseAssistantCard.ProjectImage src={project.image} /> : <SvgIcon icon="systemImage" size={45} color="#393E42" />}
      isActive={active}
      isHovered={isHovered}
      iconTooltip={
        isLockedProjectViewer
          ? {
              width: 232,
              placement: 'bottom',
              interactive: true,
              content: (
                <TippyTooltip.FooterButton
                  onClick={stopPropagation(Utils.functional.chain(TippyTooltip.closeAll, () => paymentModal.openVoid({})))}
                  buttonText="Upgrade Now"
                >
                  Starter plans are limited to 2 editable Assistants. Upgrade to unlock unlimited Assistants.
                </TippyTooltip.FooterButton>
              ),
            }
          : { content: platformName }
      }
      action={
        <>
          {onClickCard && <S.StyledLink onClick={onClickCard} />}

          <Box.Flex zIndex={100} flexDirection="row">
            <Button onClick={onClickDesigner} variant={Button.Variant.PRIMARY} squareRadius>
              {!editProject.allowed ? 'View' : 'Designer'}
            </Button>

            {editProject.allowed && (
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
              <Members.AvatarList members={members} small />
            </S.MembersContainer>
          )}
        </>
      }
    />
  );
};
