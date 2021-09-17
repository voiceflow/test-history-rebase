import { Button, ButtonVariant, Dropdown, IconButton, KeyName } from '@voiceflow/ui';
import cn from 'classnames';
import _constant from 'lodash/constant';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Form from '@/components/LegacyForm';
import { Permission } from '@/config/permissions';
import { ScrollContextProvider } from '@/contexts';
import withDraggable from '@/hocs/withDraggable';
import { usePermission } from '@/hooks';
import { useHorizontalScrollToNode, useScrollHelpers, useScrollShadows } from '@/hooks/scroll';
import { useToggle } from '@/hooks/toggle';
import { DashboardClassName } from '@/styles/constants';

import DragZone from './DragZone';
import Item from './Item';

const DropContainer = withDraggable({
  name: 'dashboard-item',
  canDrag: _constant(false),
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
    onMoveProject,
    onDropProject,
    connectDragSource,
    isDraggingPreview,
    connectDropTarget,
    createProject,
  } = props;

  const isEmpty = !projects || !projects.length;

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const [canManageLists] = usePermission(Permission.MANAGE_PROJECT_LISTS);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);

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
      style={{ cursor: !canManageLists ? 'default' : undefined }}
      className={cn(DashboardClassName.LIST, {
        '__is-draggable __is-dragging': isDraggingPreview,
      })}
    >
      <Form
        onRef={(node) => {
          listRef.current = node;
        }}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
              {isDragging && <div style={{ top: 0, left: 0, right: 0, bottom: 0 }} className={cn('h-pos-a', DashboardClassName.LIST_DROPZONE)} />}

              <DropContainer
                id={0}
                index={0}
                listId={id}
                onMove={onMoveProject}
                className={cn(DashboardClassName.LIST_HEADER, {
                  'h-o-0': isDragging,
                  __scrolling: isHeaderShadowShown,
                })}
              >
                <div className={DashboardClassName.LIST_HEADER_MAIN}>
                  <input
                    ref={inputRef}
                    className={cn('borderless-input', DashboardClassName.LIST_HEADER_TITLE)}
                    value={values.name}
                    onBlur={onInputNameBlur}
                    selected
                    disabled={!canManageLists}
                    onChange={({ target }) => handleChange('name', target.value)}
                    onKeyPress={({ key }) => key === KeyName.ENTER && onInputNameBlur()}
                    maxLength={32}
                    placeholder="Enter list name"
                  />
                </div>

                {canManageLists && (
                  <div className={DashboardClassName.LIST_HEADER_ASIDE}>
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
                        <IconButton icon="ellipsis" variant="flat" active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                      )}
                    </Dropdown>
                  </div>
                )}
              </DropContainer>

              {!isEmpty && (
                <div
                  ref={bodyRef}
                  onScroll={onScroll}
                  className={cn(DashboardClassName.LIST_BODY, {
                    'h-o-0': isDragging,
                    still: !moving,
                  })}
                >
                  <div ref={innerRef} className={DashboardClassName.LIST_BODY_INNER}>
                    <ul className={DashboardClassName.PROJECT_LIST}>
                      {projects.map((project, i) => {
                        if (!project) return null;

                        return (
                          <li key={project.id} className={DashboardClassName.PROJECT_LIST_ITEM}>
                            <Item
                              index={i}
                              id={project.id}
                              versionID={project.versionID}
                              listId={id}
                              created={project.created}
                              isFB={false}
                              avatarUrl={project.image}
                              name={project.name}
                              diagram={project.diagramID}
                              platform={project.platform}
                              onDrop={onDropProject}
                              onMove={onMoveProject}
                              onToggleDragging={setMoving}
                              language={project.locales}
                              isLive={project.isLive}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              {canManageProjects && (
                <div
                  className={cn(DashboardClassName.LIST_FOOTER, {
                    'h-o-0': isDragging,
                    __scrolling: isFooterShadowShown,
                  })}
                >
                  <div className={DashboardClassName.LIST_FOOTER_CENTER}>
                    <Button variant={ButtonVariant.TERTIARY} onClick={() => createProject(id)}>
                      Create Project
                    </Button>
                  </div>
                </div>
              )}
            </ScrollContextProvider>
          );
        }}
      </Form>
      {isDragging && <DragZone className={DashboardClassName.LIST_DRAGZONE} />}
    </div>
  );

  return canManageLists && connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(list)) : list;
}

export default withDraggable({
  name: 'dashboard-list',
  styles: { display: 'flex' },
  canDrag: (props) => !props.disableDragging,
  canDrop: _constant(true),
  onMoveKey: 'onMove',
  onDropKey: 'onDrop',
  allowXTransform: true,
  allowYTransform: false,
})(List);

List.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  projects: PropTypes.array,
  createProject: PropTypes.func,
  onRename: PropTypes.func,
  onRemove: PropTypes.func,
  isCreated: PropTypes.bool,
  isDragging: PropTypes.bool,
  projectIds: PropTypes.arrayOf(PropTypes.number),
  onCancelCreate: PropTypes.func,
  disableDragging: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDraggingPreview: PropTypes.bool,
};

List.defaultProps = {
  name: 'New List',
  listType: 'projects',
  projectIds: [],
};
