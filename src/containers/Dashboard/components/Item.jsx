import cn from 'classnames';
import Dropdown from 'components/Dropdown';
import Link from 'components/Link';
import withDraggable from 'hocs/withDraggable';
import { useToggle } from 'hooks/toggle';
import * as _ from 'lodash';
import map from 'lodash/map';
import upperCase from 'lodash/upperCase';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { colors } from 'utils/colors';
import { getHumanLanguageName } from 'utils/languages';

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
};

export function Item(props) {
  const {
    name,
    created,
    diagram,
    language,
    uploaded,
    onRemove,
    avatarUrl,
    isDragging,
    version_id,
    onDuplicate,
    connectDragSource,
    connectDropTarget,
    isDraggingPreview,
  } = props;

  const [isDropdownOpened, toggleDropdownOpened] = useToggle();
  const pathTo = `/canvas/${version_id}/${diagram}`;

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
        <div
          style={{
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
          }}
          className={`projects-list__item-image cap-${color}`}
        >
          {!avatarUrl && upperCase(name).charAt(0)}
        </div>

        <div className="projects-list__item-actions">
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
            label={<i className="far fa-ellipsis-h" />}
          />
        </div>

        <div className="projects-list__item-details">
          <div className="projects-list__item-title">{name}</div>
          <div className="projects-list__item-caption">{map(language, (l) => getHumanLanguageName(l)).join(', ')}</div>
        </div>

        <Tooltip position="top" title={uploaded ? 'Live' : 'Development'} className="projects-list__item-status" distance={10}>
          <i className={`status-indicator status-indicator-${uploaded ? 'success' : 'info'}`} />
        </Tooltip>
      </Link>

      {isDragging && <div className="projects-list__dragzone" />}
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
  uploaded: PropTypes.bool,
  avatarUrl: PropTypes.string,
  isDragging: PropTypes.bool,
  isDragLayer: PropTypes.bool,
  version_id: PropTypes.string.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};
