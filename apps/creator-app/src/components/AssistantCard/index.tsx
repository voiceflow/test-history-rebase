import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import type { TippyTooltipProps, UserData } from '@voiceflow/ui';
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
} from '@voiceflow/ui';
import React from 'react';

import type { EditableTextAPI } from '@/components/EditableText';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useLinkedState, useToggle } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { useIsLockedProjectViewer, usePermission } from '@/hooks/permission';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatAssistantName } from '@/utils/string';
import { openURLInANewTab } from '@/utils/window';

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
  const { name: platformName, isDeprecated: isDeprecatedPlatform } = Platform.Config.get(project.platform);

  const titleRef = React.useRef<EditableTextAPI | null>(null);

  const [active, toggleActive] = useToggle(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(project?.name);

  const editProject = usePermission(Permission.PROJECT_UPDATE);
  const paymentModal = usePaymentModal();
  const isLockedProjectViewer = useIsLockedProjectViewer();
  const isFree = !useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isLockedProject = isLockedProjectViewer || isDeprecatedPlatform;

  const saveProjectName = useDispatch(Project.updateProjectNameByID, project?.id || '');

  const onRename = () => {
    titleRef.current?.startEditing();
    setIsEditing(true);
  };

  const onBlur = () => {
    titleRef.current?.stopEditing();

    updateFormValue(formatAssistantName(formValue || ''));
    saveProjectName(formatAssistantName(formValue || ''));

    setIsEditing(false);
  };

  const projectOptions = useProjectOptions({
    onRename,
    projectID: project?.id,
    versionID: project?.versionID,
    withInvite: true,
  });

  const getIconTooltip = () => {
    if (isLockedProjectViewer && !isFree) return undefined;
    if (isLockedProject) {
      return {
        width: 232,
        placement: 'bottom' as TippyTooltipProps['placement'],
        interactive: true,
        content: isDeprecatedPlatform ? (
          <TippyTooltip.FooterButton
            onClick={() => openURLInANewTab('https://insiders.voiceflow.com/google2voice')}
            buttonText="Convert File"
          >
            Google Conversation Actions are no longer supported. Convert your file to access designs.
          </TippyTooltip.FooterButton>
        ) : (
          <TippyTooltip.FooterButton
            onClick={stopPropagation(Utils.functional.chain(TippyTooltip.closeAll, () => paymentModal.openVoid({})))}
            buttonText="Upgrade to Pro"
          >
            Agent limit reached. Upgrade to Pro to unlock all agents.
          </TippyTooltip.FooterButton>
        ),
      };
    }
    return { content: platformName };
  };

  return (
    <BaseAssistantCard
      icon={isLockedProject ? 'lockLocked' : logo || icon.name}
      image={
        project.image ? (
          <BaseAssistantCard.ProjectImage src={project.image} />
        ) : (
          <SvgIcon icon="systemImage" size={45} color="#393E42" />
        )
      }
      isActive={active}
      isHovered={isHovered}
      iconTooltip={getIconTooltip()}
      action={
        <>
          {onClickCard && !isDeprecatedPlatform && <S.StyledLink onClick={onClickCard} />}

          <Box.Flex zIndex={100} flexDirection="row">
            {!isDeprecatedPlatform && (
              <Button onClick={onClickDesigner} variant={Button.Variant.PRIMARY} squareRadius>
                {!editProject.allowed ? 'View' : 'Designer'}
              </Button>
            )}

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
