import React, { useRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ScrollContextProvider } from 'contexts';

import { useToggle } from 'hooks/toggle';
import { useScrollShadows, useScrollHelpers, useHorizontalScrollToNode } from 'hooks/scroll';

import withDraggable from 'hocs/withDraggable';

import { colors } from 'utils/colors';

import Form from 'components/Form';
import Input from 'components/Input';
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
    projectIds,
    isDragging,
    itemReorder,
    onMoveSkill,
    onDropSkill,
    onRenameSkill,
    onRemoveSkill,
    disableDragging,
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
    projectIds,
  ]);

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
                id={projectIds[0] || 0}
                index={0}
                listId={id}
                onMove={onMoveSkill}
                className={cn("main-list-header", {
                  "h-o-0": isDragging,
                  __scrolling: isHeaderShadowShown
                })}
              >
                <div className="main-list-header__main">
                  {isTitleEditable ? (
                    <div className="main-list-header__input">
                      <input
                        className="borderless-input"
                        value={values.name}
                        onBlur={onInputNameBlur}
                        selected
                        onChange={({ target }) =>
                          handleChange("name", target.value)
                        }
                        autoFocus
                        placeholder="Enter list name"
                        // onEnterPress={onInputNameBlur}
                        // onEscapePress={toggleTitleEditable}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
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
                    "h-o-0": isDragging
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
                              id={project.skill_id}
                              project_id={project.project_id}
                              isFB={false}
                              avatarUrl={icon}
                              name={project.name}
                              diagram={project.diagram}
                              reorder={itemReorder}
                              index={i}
                              color={colors[i % colors.length]}
                              listId={id}
                              onDrop={onDropSkill}
                              onMove={onMoveSkill}
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
                              avatarUrl={project.avatarUrl}
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
  id: PropTypes.number,
  name: PropTypes.string,
  projects: PropTypes.array,
  createSkill: PropTypes.func,
  listType: PropTypes.oneOf(['projects', 'flash_briefings']),
  onRename: PropTypes.func,
  onRemove: PropTypes.func,
  isCreated: PropTypes.bool,
  isDragging: PropTypes.bool,
  projectIds: PropTypes.arrayOf(PropTypes.number),
  onDropSkill: PropTypes.func,
  onMoveSkill: PropTypes.func,
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
