import { Dropdown, stopPropagation, SvgIcon } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Avatar from '@/components/Avatar';
import { Permission } from '@/config/permissions';
import { RootRoute } from '@/config/routes';
import withDraggable from '@/hocs/withDraggable';
import { usePermission, useProjectOptions } from '@/hooks';
import { PROJECT_COLORS } from '@/styles/colors';
import { DashboardClassName } from '@/styles/constants';
import { getHumanLanguageName } from '@/utils/languages';
import { getPlatformAppName } from '@/utils/platform';

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

export function Item(props) {
  const { id, name, listId, diagram, language, isLive, avatarUrl, isDragging, platform, versionID, connectDragSource, connectDropTarget } = props;

  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);
  const titleRef = React.useRef(null);
  const [titleOverflowing, setTitleOverflowing] = React.useState(false);
  const dateFromID = new Date(parseInt(id.substring(0, 8), 16));
  const color = PROJECT_COLORS[dateFromID.getTime() % PROJECT_COLORS.length] || PROJECT_COLORS[0];

  const TitleWrapper = titleOverflowing ? Tooltip : React.Fragment;
  const options = useProjectOptions({
    boardID: listId,
    projectID: id,
    projectName: name,
  });

  React.useEffect(() => {
    setTitleOverflowing(titleRef?.current?.scrollWidth > titleRef?.current?.clientWidth);
  }, [titleRef]);

  const hasOptions = !!options.length;

  const item = (
    <div>
      <ProjectListItem hasOptions={hasOptions} to={`/${RootRoute.PROJECT}/${versionID}/canvas/${diagram}`} hidden={isDragging} tabIndex={0}>
        <Dropdown options={options}>
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
              <ProjectTitle ref={titleRef} className={DashboardClassName.PROJECT_LIST_ITEM_TITLE}>
                {name}
              </ProjectTitle>
            </TitleWrapper>
            <ProjectTitleCaption>
              <span>
                {getPlatformAppName(platform)} {!!language.length && '-'}
              </span>
              {_map(language, (l) => getHumanLanguageName(l)).join(', ')}
            </ProjectTitleCaption>
          </ProjectTitleDetails>

          <Tooltip position="top" title={isLive ? 'Live' : 'Design'} className={DashboardClassName.PROJECT_LIST_ITEM_STATUS} distance={10}>
            <SvgIcon
              icon={isLive ? 'outlinedFilledCircle' : 'outlinedCircle'}
              color={isLive ? '#43A047' : '#059fe4'}
              size={12}
              className="status-indicator"
            />
          </Tooltip>
        </ProjectNameWrapper>
      </ProjectListItem>

      {isDragging && <ProjectListDragZone />}
    </div>
  );

  return canManageProjects && connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(item)) : item;
}

export default withDraggable({
  name: 'dashboard-item',
  canDrag: (props) => !props.disableDragging,
  canDrop: _constant(true),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
  allowXTransform: true,
})(React.memo(Item));

Item.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  isOver: PropTypes.bool,
  listId: PropTypes.string.isRequired,
  language: PropTypes.array.isRequired,
  isLive: PropTypes.bool,
  avatarUrl: PropTypes.string,
  isDragging: PropTypes.bool,
  isDragLayer: PropTypes.bool,
  versionID: PropTypes.string.isRequired,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};
