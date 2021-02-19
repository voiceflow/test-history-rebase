import _constant from 'lodash/constant';
import map from 'lodash/map';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Avatar from '@/components/Avatar';
import Dropdown from '@/components/Dropdown';
import SvgIcon from '@/components/SvgIcon';
import { Permission } from '@/config/permissions';
import { RootRoute } from '@/config/routes';
import { ModalType, PLATFORM_APP_NAME } from '@/constants';
import withDraggable from '@/hocs/withDraggable';
import { useModals, usePermission } from '@/hooks';
import { useToggle } from '@/hooks/toggle';
import { PROJECT_COLORS } from '@/styles/colors';
import { stopPropagation } from '@/utils/dom';
import { getHumanLanguageName } from '@/utils/languages';

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
  const {
    id,
    name,
    diagram,
    language,
    isLive,
    onRemove,
    avatarUrl,
    isDragging,
    platform,
    version_id,
    onDuplicate,
    onDownload,
    connectDragSource,
    connectDropTarget,
  } = props;

  const [isDropdownOpened, toggleDropdownOpened] = useToggle();
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);
  const [canCloneProject] = usePermission(Permission.CLONE_PROJECT);

  const { open: openCloneModal } = useModals(ModalType.IMPORT_PROJECT);
  const dateFromID = new Date(parseInt(id.substring(0, 8), 16));
  const color = PROJECT_COLORS[dateFromID.getTime() % PROJECT_COLORS.length] || PROJECT_COLORS[0];
  const options = canManageProjects
    ? [
        {
          value: 'duplicate',
          label: 'Duplicate Project',
          onClick: onDuplicate,
        },
        {
          value: 'download',
          label: 'Copy Download Link',
          onClick: onDownload,
        },
        {
          value: 'remove',
          label: 'Remove Project',
          onClick: onRemove,
        },
      ]
    : [];

  if (canCloneProject) {
    const cloneOption = {
      value: 'clone',
      label: 'Clone Project',
      onClick: async () => {
        openCloneModal({ cloning: true, projectID: id });
      },
    };
    options.push(cloneOption);
  }

  const hasOptions = !!options.length;

  const item = (
    <div>
      <ProjectListItem
        hasOptions={hasOptions}
        to={`/${RootRoute.PROJECT}/${version_id}/canvas/${diagram}`}
        hidden={isDragging}
        isActive={isDropdownOpened}
        tabIndex={0}
        onBlur={() => toggleDropdownOpened(false)}
      >
        <Dropdown options={options}>
          {(ref, onToggle) =>
            hasOptions ? (
              <DropdownIconWrapper
                onClick={stopPropagation(() => {
                  toggleDropdownOpened();
                  onToggle();
                })}
                ref={ref}
              >
                <Avatar url={avatarUrl} name={name} color={color} />
                <ProjectListItemActions>
                  <SvgIcon icon="elipsis" />
                </ProjectListItemActions>
              </DropdownIconWrapper>
            ) : (
              <DropdownIconWrapper>
                <Avatar noHover url={avatarUrl} name={name} color={color} />
              </DropdownIconWrapper>
            )
          }
        </Dropdown>
        <ProjectNameWrapper>
          <ProjectTitleDetails>
            <ProjectTitle className="projects-list__item-title">{name}</ProjectTitle>
            <ProjectTitleCaption>
              <span>
                {PLATFORM_APP_NAME[platform]} {!!language.length && '-'}{' '}
              </span>
              {map(language, (l) => getHumanLanguageName(l)).join(', ')}
            </ProjectTitleCaption>
          </ProjectTitleDetails>

          <Tooltip position="top" title={isLive ? 'Live' : 'Development'} className="projects-list__item-status" distance={10}>
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
  onRemove: PropTypes.func.isRequired,
  language: PropTypes.array.isRequired,
  isLive: PropTypes.bool,
  avatarUrl: PropTypes.string,
  isDragging: PropTypes.bool,
  isDragLayer: PropTypes.bool,
  version_id: PropTypes.string.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};
