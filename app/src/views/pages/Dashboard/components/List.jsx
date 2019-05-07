import React, { useRef, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ScrollContextProvider } from 'contexts';

import { useToggle } from 'hooks/toggle';
import { useScrollShadows, useScrollHelpers, useHorizontalScrollToNode } from 'hooks/scroll';

import withDraggable from 'hocs/withDraggable';

import Form from 'components/Form';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';

import Item from './Item';

const DropContainer = withDraggable({
  name: 'dashboard-item',
  canDrag: () => false,
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
})(
  ({ children, className, connectDropTarget }) =>
    connectDropTarget && connectDropTarget(<div className={className}>{children}</div>)
);

const DROPDOWN_OPTIONS = [
  {
    id: "rename",
    label: "Edit Name"
  },
  {
    id: "remove",
    label: "Remove List"
  }
];

const DROPDOWN_BUTTON_PROPS = {
  icon: "more",
  isDropdown: true,
};


export function List(props) {
  const {
    id,
    name,
    projects,
    onRename,
    onRemove,
    isCreated,
    isDragging,
    onRenameSkill,
    onRemoveSkill,
    onMoveProject,
    onDropProject,
    onDuplicateSkill,
    connectDragSource,
    isDraggingPreview,
    connectDropTarget,
    createSkill,
  } = props;

  let handleDuplicateSkill;

  const isEmpty = !projects || !projects.length;

  const listRef = useRef(null);

  const [isTitleEditable, toggleTitleEditable] = useToggle(isCreated);
  const [isCreatingSkill] = useToggle(false);

    handleDuplicateSkill = onDuplicateSkill;

  useHorizontalScrollToNode(listRef, isCreated, [id, isCreated]);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();

  const [onScroll, isHeaderShadowShown, isFooterShadowShown] = useScrollShadows(bodyRef, [
    projects,
  ]);

  const [moving, setMoving] = useState(false)

  const list = (
    <div
      style={{ background: isDraggingPreview ? 'transparent' : null }}
      className={cn('main-list', {
        '__is-draggable __is-dragging': isDraggingPreview,
      })}
    >
      <Form
        onRef={node => (listRef.current = node)}
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
            toggleTitleEditable();

            values.name && onRename && values.name !== name && onRename(id, values.name);
          };

          return (
            <ScrollContextProvider value={scrollHelpers}>
              {isDragging && (
                <div
                  style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  className="h-pos-a main-list-dropzone"
                />
              )}

              <DropContainer
                id={0}
                index={0}
                listId={id}
                onMove={onMoveProject}
                className={cn("main-list-header", {
                  "h-o-0": isDragging,
                  __scrolling: isHeaderShadowShown
                })}
              >
                <div className="main-list-header__main">
                  {isTitleEditable ? (
                      <input
                        className="borderless-input main-list-header__title"
                        value={values.name}
                        onBlur={onInputNameBlur}
                        selected
                        onChange={({ target }) =>
                          handleChange("name", target.value)
                        }
                        onKeyPress={({ charCode }) => (charCode === 13) && onInputNameBlur()}
                        autoFocus
                        placeholder="Enter list name"
                      />
                  ) : (
                    <div
                      onClick={(e) => {
                        handleChange("name", name)
                        toggleTitleEditable(e)
                      }}
                      className="main-list-header__title"
                    >
                      {name}
                    </div>
                  )}
                </div>

                <div className="main-list-header__aside">
                  <Dropdown
                    options={DROPDOWN_OPTIONS}
                    onRemove={onRemove}
                    onRename={toggleTitleEditable}
                    buttonProps={DROPDOWN_BUTTON_PROPS}
                    label={<i className="far fa-ellipsis-h" />}
                  />
                </div>
              </DropContainer>

              {!isEmpty && (
                <div
                  ref={bodyRef}
                  onScroll={onScroll}
                  className={cn("main-list-body", {
                    "h-o-0": isDragging,
                    "still": !moving
                  })}
                >
                  <div
                    ref={innerRef}
                    className="main-list-body-inner"
                  >
                    <ul className="projects-list">
                      {projects.map((project, i) => {
                        let icon;
                        let smallIcon = project.small_icon;
                        let largeIcon = project.large_icon;
                        if (!!largeIcon) {
                          icon = largeIcon;
                        } else if (!!smallIcon) {
                          icon = smallIcon;
                        }
                        return !project ? null : (
                          <li
                            key={project.project_id}
                            className="projects-list__list-item"
                          >
                            <Item
                              index={i}
                              id={project.project_id}
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
                              onRename={() =>
                                onRenameSkill(project.project_id)
                              }
                              uploaded={project.isLive}
                              onRemove={() =>
                                onRemoveSkill(
                                  project.project_id,
                                  project.name
                                )
                              }
                              onDuplicate={() =>
                                handleDuplicateSkill(
                                  project.project_id,
                                  id
                                )
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              <div
                className={cn("main-list-footer", {
                  "h-o-0": isDragging,
                  __scrolling: isFooterShadowShown
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
  canDrag: props => !props.disableDragging,
  canDrop: () => true,
  onMoveKey: 'onMove',
  onDropKey: 'onDrop',
  allowXTransform: true,
  allowYTransform: false,
})(List);

List.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  projects: PropTypes.array,
  createSkill: PropTypes.func,
  listType: PropTypes.oneOf(['projects', 'flash_briefings']),
  onRename: PropTypes.func,
  onRemove: PropTypes.func,
  isCreated: PropTypes.bool,
  isDragging: PropTypes.bool,
  projectIds: PropTypes.arrayOf(PropTypes.number),
  onRenameSkill: PropTypes.func,
  onRemoveSkill: PropTypes.func,
  onCancelCreate: PropTypes.func,
  disableDragging: PropTypes.bool,
  onDuplicateSkill: PropTypes.func,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};

List.defaultProps = {
  name: 'New List',
  listType: 'projects',
  projectIds: [],
};
