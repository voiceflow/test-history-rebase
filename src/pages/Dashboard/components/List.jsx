import cn from 'classnames';
import _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton from '@/components/IconButton';
import Button from '@/components/LegacyButton';
import Form from '@/components/LegacyForm';
import { ScrollContextProvider } from '@/contexts';
import withDraggable from '@/hocs/withDraggable';
import { useHorizontalScrollToNode, useScrollHelpers, useScrollShadows } from '@/hooks/scroll';
import { useToggle } from '@/hooks/toggle';

import Item from './Item';

const DropContainer = withDraggable({
  name: 'dashboard-item',
  canDrag: _.constant(false),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
})(({ children, className, connectDropTarget }) => connectDropTarget && connectDropTarget(<div className={className}>{children}</div>));

export function List(props) {
  const {
    id,
    name,
    isNew,
    projects,
    onRename,
    onRemove,
    isCreated,
    isDragging,
    clearNewBoard,
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
    if (isNew) {
      inputRef.current.focus();
      clearNewBoard(id);
    }
  }, []);

  const list = (
    <div
      className={cn('main-list', {
        '__is-draggable __is-dragging': isDraggingPreview,
      })}
    >
      <Form
        onRef={(node) => {
          listRef.current = node;
        }}
        style={{ height: isDraggingPreview || isDragging ? '100%' : null }}
        className={cn({
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
                    options={[
                      {
                        label: 'Remove List',
                        onClick: () => onRemove({ id, name, projects }),
                      },
                    ]}
                    placement="bottom-end"
                  >
                    {(ref, onToggle, isOpen) => (
                      <IconButton icon="elipsis" variant="flat" active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                    )}
                  </Dropdown>
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
                        const { smallIcon, largeIcon } = project;
                        if (largeIcon) {
                          icon = largeIcon;
                        } else if (smallIcon) {
                          icon = smallIcon;
                        }
                        return (
                          <li key={project.id} className="projects-list__list-item">
                            <Item
                              index={i}
                              id={project.id}
                              version_id={project.versionID}
                              listId={id}
                              created={project.created}
                              isFB={false}
                              isReference={project.reference}
                              avatarUrl={icon}
                              name={project.name}
                              diagram={project.diagramID}
                              onDrop={onDropProject}
                              onMove={onMoveProject}
                              onToggleDragging={setMoving}
                              language={project.locales}
                              isLive={project.isLive}
                              onRemove={() => onDeleteProject(project.id, project.name)}
                              onDuplicate={() => onCopyProject(project.id, id)}
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
