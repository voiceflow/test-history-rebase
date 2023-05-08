import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Dropdown, OverflowTippyTooltip, stopPropagation, SvgIcon, TippyTooltip, useLinkedState } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import { EditableTextAPI } from '@/components/EditableText';
import * as NLU from '@/config/nlu';
import { LegacyPath } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as Project from '@/ducks/project';
import { InjectedDraggableProps, withDraggable } from '@/hocs/withDraggable';
import { useIsLockedProjectViewer, usePermission } from '@/hooks/permission';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { usePaymentModal } from '@/ModalsV2/hooks';
import { PROJECT_COLORS } from '@/styles/colors';
import { DashboardClassName } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';
import { openURLInANewTab } from '@/utils/window';

import {
  DropdownIconWrapper,
  ProjectListDragZone,
  ProjectListItem,
  ProjectListItemActions,
  ProjectNameWrapper,
  ProjectTitle,
  ProjectTitleCaption,
  ProjectTitleDetails,
} from './styled';

export interface OwnItemProps {
  id: string;
  nlu: Platform.Constants.NLUType;
  name: string;
  listID: string;
  isLive?: boolean;
  isOver?: boolean;
  created: string;
  locales: string[];
  platform: Platform.Constants.PlatformType;
  avatarUrl?: string | null;
  versionID: string;
  className?: string;
  isDragLayer?: boolean;
  projectType: Platform.Constants.ProjectType;
}

export interface ItemProps extends InjectedDraggableProps, OwnItemProps {}

export const Item: React.FC<ItemProps> = ({
  id,
  nlu,
  name,
  listID,
  isLive,
  locales,
  platform,
  versionID,
  avatarUrl,
  isDragging,
  projectType,
  connectedRootRef,
  isDraggingPreview,
}) => {
  const projectConfig = Platform.Config.getTypeConfig({ type: projectType, platform });
  const platformConfig = Platform.Config.get(platform);

  const paymentModal = usePaymentModal();
  const [canManageProjects] = usePermission(Permission.PROJECTS_MANAGE, { workspaceOnly: true });
  const isLockedProjectViewer = useIsLockedProjectViewer();
  const isLockedProject = isLockedProjectViewer || platformConfig.isDeprecated;

  const saveProjectName = useDispatch(Project.updateProjectNameByID, id);

  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(name);

  const titleEditableRef = React.useRef<EditableTextAPI | null>(null);

  const onRename = () => {
    titleEditableRef.current?.startEditing();
    setIsEditing(true);
  };

  const onBlur = () => {
    titleEditableRef.current?.stopEditing();

    updateFormValue(formatProjectName(formValue));
    saveProjectName(formatProjectName(formValue));

    setIsEditing(false);
  };

  const options = useProjectOptions({
    boardID: listID,
    onRename,
    projectID: id,
    versionID,
    withInvite: true,
    withConvertToDomain: true,
  });

  const color = React.useMemo(() => {
    const dateFromID = new Date(parseInt(id.substring(0, 8), 16));

    return PROJECT_COLORS[dateFromID.getTime() % PROJECT_COLORS.length] || PROJECT_COLORS[0];
  }, [id]);

  const nluName = NLU.Config.isSupported(platform) ? NLU.Config.get(nlu).name : platformConfig.name;

  const platformNameLabel =
    platformConfig.oneClickPublish || NLU.Voiceflow.CONFIG.is(nlu) ? projectConfig.project.name : `${projectConfig.project.name}, ${nluName}`;

  return (
    <div ref={canManageProjects && !isDraggingPreview ? connectedRootRef : undefined}>
      <ProjectListItem
        to={generatePath(LegacyPath.PROJECT_CANVAS, { versionID })}
        hidden={isDragging}
        tabIndex={0}
        hasOptions={!!options.length}
        locked={isLockedProject}
      >
        {isLockedProject ? (
          <TippyTooltip
            width={232}
            display="flex"
            placement="bottom"
            interactive
            content={
              platformConfig.isDeprecated ? (
                <TippyTooltip.FooterButton onClick={() => openURLInANewTab('https://insiders.voiceflow.com/google2voice')} buttonText="Convert File">
                  Google Conversation Actions are no longer supported. Convert your file to access designs.
                </TippyTooltip.FooterButton>
              ) : (
                <TippyTooltip.FooterButton
                  onClick={stopPropagation(Utils.functional.chain(TippyTooltip.closeAll, () => paymentModal.openVoid({})))}
                  buttonText="Upgrade to Pro"
                >
                  Assistant limit reached. Upgrade to Pro to unlock all assistants.
                </TippyTooltip.FooterButton>
              )
            }
          >
            <DropdownIconWrapper className={DashboardClassName.PROJECT_LIST_ITEM_ACTIONS}>
              <ProjectListItemActions locked>
                <SvgIcon icon="lockLocked" />
              </ProjectListItemActions>
            </DropdownIconWrapper>
          </TippyTooltip>
        ) : (
          <Dropdown options={options} selfDismiss>
            {({ ref, onToggle, isOpen }) =>
              options.length ? (
                <DropdownIconWrapper className={DashboardClassName.PROJECT_LIST_ITEM_ACTIONS} onClick={stopPropagation(() => onToggle())} ref={ref}>
                  {!isOpen && <Avatar url={avatarUrl} name={name} color={color} />}

                  <ProjectListItemActions active={isOpen}>
                    <SvgIcon icon="ellipsis" />
                  </ProjectListItemActions>
                </DropdownIconWrapper>
              ) : (
                <DropdownIconWrapper className={DashboardClassName.PROJECT_LIST_ITEM_ACTIONS}>
                  <Avatar noHover url={avatarUrl} name={name} color={color} />
                </DropdownIconWrapper>
              )
            }
          </Dropdown>
        )}

        <ProjectNameWrapper>
          <ProjectTitleDetails>
            <OverflowTippyTooltip content={name} overflow>
              {(ref) => (
                <ProjectTitle
                  ref={(editableText) => {
                    titleEditableRef.current = editableText;

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    ref.current = editableText?.titleRef?.current;
                  }}
                  className={DashboardClassName.PROJECT_LIST_ITEM_TITLE}
                  readOnly={!isEditing}
                  value={formValue}
                  onClick={!isEditing ? undefined : stopPropagation()}
                  onBlur={onBlur}
                  onChange={updateFormValue}
                  onKeyPress={withEnterPress(withInputBlur())}
                />
              )}
            </OverflowTippyTooltip>

            <ProjectTitleCaption>
              <span>
                {platformNameLabel} {!!locales.length && '-'}
              </span>
              {locales.map((locale) => projectConfig.project.locale.labelMap[locale]).join(', ')}
            </ProjectTitleCaption>
          </ProjectTitleDetails>

          {!platformConfig.isDeprecated && (
            <TippyTooltip
              offset={[0, 10]}
              content={isLive ? 'Production' : 'Design'}
              position="top"
              className={DashboardClassName.PROJECT_LIST_ITEM_STATUS}
            >
              <SvgIcon
                icon={isLive ? 'outlinedFilledCircle' : 'outlinedCircle'}
                color={isLive ? '#43A047' : '#059fe4'}
                size={12}
                className="status-indicator"
              />
            </TippyTooltip>
          )}
        </ProjectNameWrapper>
      </ProjectListItem>

      {isDragging && <ProjectListDragZone />}
    </div>
  );
};

export default withDraggable<OwnItemProps>({
  name: 'dashboard-item',
  canDrag: (monitor) => !monitor.getItem()?.disableDragging,
  allowXTransform: true,
})(React.memo(Item));
