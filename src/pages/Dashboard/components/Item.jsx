import _ from 'lodash';
import map from 'lodash/map';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Avatar from '@/components/Avatar';
import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import withDraggable from '@/hocs/withDraggable';
import { useToggle } from '@/hooks/toggle';
import { PROJECT_COLORS } from '@/styles/colors';
import { stopPropagation } from '@/utils/dom';
import { getHumanLanguageName } from '@/utils/languages';
import { RootRoutes } from '@/utils/routes';

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
    created,
    diagram,
    language,
    isLive,
    onRemove,
    avatarUrl,
    isDragging,
    version_id,
    onDuplicate,
    connectDragSource,
    connectDropTarget,
    isReference,
  } = props;

  const [isDropdownOpened, toggleDropdownOpened] = useToggle();

  const pathTo = isReference ? `/reference/${id}` : `/${RootRoutes.PROJECT}/${version_id}/canvas/${diagram}`;
  const color = PROJECT_COLORS[new Date(created).getTime() % PROJECT_COLORS.length];
  const options = [
    {
      value: 'duplicate',
      label: 'Copy Project',
      onClick: onDuplicate,
    },
    {
      value: 'remove',
      label: 'Remove Project',
      onClick: onRemove,
    },
  ];

  const item = (
    <div>
      <ProjectListItem to={pathTo} hidden={isDragging} isActive={isDropdownOpened} tabIndex={0} onBlur={toggleDropdownOpened}>
        <Dropdown options={options}>
          {(ref, onToggle) => (
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
          )}
        </Dropdown>
        <ProjectNameWrapper>
          <ProjectTitleDetails>
            <ProjectTitle>{name}</ProjectTitle>
            <ProjectTitleCaption>{map(language, (l) => getHumanLanguageName(l)).join(', ')}</ProjectTitleCaption>
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

  return connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(item)) : item;
}

export default withDraggable({
  name: 'dashboard-item',
  canDrag: (props) => !props.disableDragging,
  canDrop: _.constant(true),
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
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};
