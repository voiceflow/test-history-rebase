import { Constants } from '@voiceflow/general-types';
import { Dropdown, stopPropagation, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import Avatar from '@/components/Avatar';
import { EditableTextAPI } from '@/components/EditableText';
import { Permission } from '@/config/permissions';
import { RootRoute } from '@/config/routes';
import * as Project from '@/ducks/project';
import { InjectedDraggableComponentProps, withDraggable } from '@/hocs';
import { useDispatch, useLinkedState, usePermission, useProjectOptions } from '@/hooks';
import { PROJECT_COLORS } from '@/styles/colors';
import { DashboardClassName } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { getHumanLanguageName } from '@/utils/languages';
import { getPlatformAppName } from '@/utils/platform';
import { formatProjectName } from '@/utils/string';

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

export interface ItemProps extends InjectedDraggableComponentProps {
  id: string;
  name: string;
  created: string;
  diagram: string;
  isOver?: boolean;
  listId: string;
  language: string[];
  isLive?: boolean;
  avatarUrl?: string | null;
  isDragging?: boolean;
  isDragLayer?: boolean;
  versionID: string;
  isDraggingPreview?: boolean;
  platform: Constants.PlatformType;
}

export const Item: React.FC<ItemProps> = ({
  id,
  name,
  listId,
  diagram,
  language,
  isLive,
  avatarUrl,
  isDragging,
  platform,
  versionID,
  connectDragSource,
  connectDropTarget,
}) => {
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);
  const titleRef = React.useRef<EditableTextAPI | null>(null);
  const [titleOverflowing, setTitleOverflowing] = React.useState(false);
  const dateFromID = new Date(parseInt(id.substring(0, 8), 16));
  const color = PROJECT_COLORS[dateFromID.getTime() % PROJECT_COLORS.length] || PROJECT_COLORS[0];

  const [isEditing, setIsEditing] = React.useState(false);
  const [formValue, updateFormValue] = useLinkedState(name);
  const saveProjectName = useDispatch(Project.updateProjectNameByID, id);
  const onRename = () => {
    titleRef.current?.startEditing();
    setIsEditing(true);
  };
  const onBlur = () => {
    titleRef.current?.stopEditing();

    updateFormValue(formatProjectName(formValue));
    saveProjectName(formatProjectName(formValue));

    setIsEditing(false);
  };

  const TitleWrapper = titleOverflowing ? TippyTooltip : React.Fragment;
  const options = useProjectOptions({
    boardID: listId,
    projectID: id,
    projectName: name,
    onRename,
    versionID,
  });

  React.useEffect(() => {
    if (!titleRef.current?.titleRef.current) {
      return;
    }

    const spanTitleRef = titleRef.current.titleRef.current;

    setTitleOverflowing(spanTitleRef.scrollWidth > spanTitleRef.clientWidth);
  }, [name]);

  const hasOptions = !!options.length;

  const item = (
    <div>
      <ProjectListItem hasOptions={hasOptions} to={`/${RootRoute.PROJECT}/${versionID}/canvas/${diagram}`} hidden={isDragging} tabIndex={0}>
        <Dropdown options={options} selfDismiss>
          {(ref, onToggle, isOpen) =>
            hasOptions ? (
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

        <ProjectNameWrapper>
          <ProjectTitleDetails>
            <TitleWrapper {...(titleOverflowing ? { title: name } : {})}>
              <ProjectTitle
                ref={titleRef}
                className={DashboardClassName.PROJECT_LIST_ITEM_TITLE}
                readOnly={!isEditing}
                value={formValue}
                onBlur={onBlur}
                onChange={updateFormValue}
                onClick={stopPropagation()}
                onKeyPress={withEnterPress(withInputBlur())}
              />
            </TitleWrapper>
            <ProjectTitleCaption>
              <span>
                {getPlatformAppName(platform)} {!!language.length && '-'}
              </span>
              {language.map(getHumanLanguageName).join(', ')}
            </ProjectTitleCaption>
          </ProjectTitleDetails>

          <TippyTooltip position="top" title={isLive ? 'Live' : 'Design'} className={DashboardClassName.PROJECT_LIST_ITEM_STATUS} distance={10}>
            <SvgIcon
              icon={isLive ? 'outlinedFilledCircle' : 'outlinedCircle'}
              color={isLive ? '#43A047' : '#059fe4'}
              size={12}
              className="status-indicator"
            />
          </TippyTooltip>
        </ProjectNameWrapper>
      </ProjectListItem>

      {isDragging && <ProjectListDragZone />}
    </div>
  );

  return canManageProjects && connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(item)) : item;
};

export default withDraggable({
  name: 'dashboard-item',
  canDrag: (props) => !props.disableDragging,
  canDrop: _constant(true),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
  allowXTransform: true,
})<ItemProps>(React.memo(Item));
