import cn from 'classnames';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Form from 'components/Form';
import { ScrollContextProvider } from 'contexts';
import withDraggable from 'hocs/withDraggable';
import { useHorizontalScrollToNode, useScrollHelpers, useScrollShadows } from 'hooks/scroll';
import { useToggle } from 'hooks/toggle';
import * as _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Item from './Item';

const DropContainer = withDraggable({
  name: 'dashboard-item',
  canDrag: _.constant(false),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
})(({ children, className, connectDropTarget }) => connectDropTarget && connectDropTarget(<div className={className}>{children}</div>));

const DROPDOWN_OPTIONS = [
  {
    id: 'remove',
    label: 'Remove List',
  },
];

const DROPDOWN_BUTTON_PROPS = {
  icon: 'more',
  isDropdown: true,
};

export function List(props) {
  const {
    id,
    name,
    projects,
    focused,
    onRename,
    onRemove,
    setFocused,
    isCreated,
    isDragging,
    onDeleteProject,
    onMoveProject,
    onDropProject,
    onCopyProject,
    connectDragSource,
    isDraggingPreview,
    connectDropTarget,
    createSkill,
  } = props;

  const isEmpty = !projects || !projects.length;

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const [isCreatingSkill] = useToggle(false);

  useHorizontalScrollToNode(listRef, isCreated, [id, isCreated]);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();

  const [onScroll, isHeaderShadowShown, isFooterShadowShown] = useScrollShadows(bodyRef, [projects]);

  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (focused === id) {
      inputRef.current.focus();
      setFocused(null);
    }
  });

  const list = (
    <div
      style={{ background: isDraggingPreview ? 'transparent' : null }}
      className={cn('main-list', {
        '__is-draggable __is-dragging': isDraggingPreview,
      })}
    >
      <Form
        onRef={(node) => {
          listRef.current = node;
        }}
        style={{ height: isDraggingPreview || isDragging ? '100%' : null }}
        className={cn('main-list', {
          hidden: isDragging,
          '__type-create': isCreatingSkill,
          '__is-draggable __is-dragging': isDraggingPreview,
        })}
        initialValues={{ name }}
        resetToInitialFields={['name']}
      >
        {({ values, handleBlur, handleChange }) => {
          const onInputNameBlur = () => {
            handleBlur('name');
            values.name && onRename && values.name !== name && onRename(id, values.name);
          };

          return (
            <ScrollContextProvider value={scrollHelpers}>
              {isDragging && <div style={{ top: 0, left: 0, right: 0, bottom: 0 }} className="h-pos-a main-list-dropzone" />}

              <DropContainer
                id={0}
                index={0}
                listId={id}
                onMove={onMoveProject}
                className={cn('main-list-header', {
                  'h-o-0': isDragging,
                  __scrolling: isHeaderShadowShown,
                })}
              >
                <div className="main-list-header__main">
                  <input
                    ref={inputRef}
                    className="borderless-input main-list-header__title"
                    value={values.name}
                    onBlur={onInputNameBlur}
                    selected
                    onChange={({ target }) => handleChange('name', target.value)}
                    onKeyPress={({ charCode }) => charCode === 13 && onInputNameBlur()}
                    maxLength={32}
                    placeholder="Enter list name"
                  />
                </div>

                <div className="main-list-header__aside">
                  <Dropdown
                    options={DROPDOWN_OPTIONS}
                    onRemove={onRemove}
                    buttonProps={DROPDOWN_BUTTON_PROPS}
                    label={<i className="far fa-ellipsis-h" />}
                  />
                </div>
              </DropContainer>

              {!isEmpty && (
                <div
                  ref={bodyRef}
                  onScroll={onScroll}
                  className={cn('main-list-body', {
                    'h-o-0': isDragging,
                    still: !moving,
                  })}
                >
                  <div ref={innerRef} className="main-list-body-inner">
                    <ul className="projects-list">
                      {projects.map((project, i) => {
                        if (!project) return null;
                        let icon;
                        const smallIcon = project.small_icon;
                        const largeIcon = project.large_icon;
                        if (largeIcon) {
                          icon = largeIcon;
                        } else if (smallIcon) {
                          icon = smallIcon;
                        }
                        return !project ? null : (
                          <li key={project.project_id} className="projects-list__list-item">
                            <Item
                              index={i}
                              id={project.project_id}
                              version_id={project.skill_id}
                              listId={id}
                              created={project.created}
                              isFB={false}
                              avatarUrl={icon}
                              name={project.name}
                              diagram={project.diagram}
                              onDrop={onDropProject}
                              onMove={onMoveProject}
                              onToggleDragging={setMoving}
                              language={project.locales}
                              uploaded={project.isLive}
                              onRemove={() => onDeleteProject(project.project_id)}
                              onDuplicate={() => onCopyProject(project.project_id, id)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              <div
                className={cn('main-list-footer', {
                  'h-o-0': isDragging,
                  __scrolling: isFooterShadowShown,
                })}
              >
                <div className="main-list-footer-center">
                  <Button isFlat isBtn onClick={() => createSkill(id)}>
                    Create Project
                  </Button>
                </div>
              </div>
            </ScrollContextProvider>
          );
        }}
      </Form>
      {isDragging && <div className="main-list__dragzone" />}
    </div>
  );

  return connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(list)) : list;
}

export default withDraggable({
  name: 'dashboard-list',
  styles: { display: 'flex' },
  canDrag: (props) => !props.disableDragging,
  canDrop: _.constant(true),
  onMoveKey: 'onMove',
  onDropKey: 'onDrop',
  allowXTransform: true,
  allowYTransform: false,
})(List);

List.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  projects: PropTypes.array,
  createSkill: PropTypes.func,
  onRename: PropTypes.func,
  onRemove: PropTypes.func,
  isCreated: PropTypes.bool,
  isDragging: PropTypes.bool,
  projectIds: PropTypes.arrayOf(PropTypes.number),
  onDeleteProject: PropTypes.func,
  onCancelCreate: PropTypes.func,
  disableDragging: PropTypes.bool,
  onCopyProject: PropTypes.func,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};

List.defaultProps = {
  name: 'New List',
  listType: 'projects',
  projectIds: [],
};
