import cn from 'classnames';
import * as _ from 'lodash';
import map from 'lodash/map';
import upperCase from 'lodash/upperCase';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/components/Dropdown';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';
import withDraggable from '@/hocs/withDraggable';
import { useToggle } from '@/hooks/toggle';
import { colors } from '@/utils/colors';
import { getHumanLanguageName } from '@/utils/languages';

import { ProjectListDragZone, ProjectNameWrapper, ProjectTitle, ProjectTitleCaption, ProjectTitleDetails } from './styled';

const DROPDOWN_OPTIONS = [
  {
    id: 'duplicate',
    label: 'Copy Project',
  },
  {
    id: 'remove',
    label: 'Remove Project',
  },
];

const DROPDOWN_BUTTON_PROPS = {
  isDropdown: true,
  className: 'projects-list__item-action',
};

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
    isDraggingPreview,
    isReference,
  } = props;

  const [isDropdownOpened, toggleDropdownOpened] = useToggle();
  const pathTo = isReference ? `/reference/${id}` : `/canvas/${version_id}/${diagram}`;

  const color = colors[new Date(created).getTime() % colors.length];

  const item = (
    <div>
      <Link
        to={pathTo}
        className={cn('projects-list__item', {
          hidden: isDragging,
          '__is-active __is-hovered': isDropdownOpened,
          '__is-draggable __is-dragging': isDraggingPreview,
        })}
      >
        <Dropdown
          options={DROPDOWN_OPTIONS}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          buttonProps={DROPDOWN_BUTTON_PROPS}
          popoverProps={{
            onShow: toggleDropdownOpened,
            onHide: toggleDropdownOpened,
            stopPropagation: true,
          }}
          label={
            <>
              <div
                style={{
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
                }}
                className={`projects-list__item-image projects-list__item-icon cap-${color}`}
              >
                {!avatarUrl && upperCase(name).charAt(0)}
              </div>
              <div className="projects-list__item-actions projects-list__item-icon far fa-ellipsis-h" />
            </>
          }
        />
        <ProjectNameWrapper>
          <ProjectTitleDetails>
            <ProjectTitle>{name}</ProjectTitle>
            <ProjectTitleCaption>{map(language, (l) => getHumanLanguageName(l)).join(', ')}</ProjectTitleCaption>
          </ProjectTitleDetails>

          <Tooltip position="top" title={isLive ? 'Live' : 'Development'} className="projects-list__item-status" distance={10}>
            <SvgIcon
              icon={isLive ? 'outlinedFilledCircle' : 'outlinedCircle'}
              color={isLive ? '#43A047' : '#5D9DF5'}
              size={14}
              className="status-indicator"
            />
          </Tooltip>
        </ProjectNameWrapper>
      </Link>

      {isDragging && <ProjectListDragZone />}
    </div>
  );

  return connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(item)) : item;
}

export default withDraggable({
  name: _.constant('dashboard-item'),
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
