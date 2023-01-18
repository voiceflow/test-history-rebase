import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import cn from 'classnames';
import _constant from 'lodash/constant';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import { DragItem as BaseDragItem, DropOptions, HoverItem, InjectedDraggableComponentProps, withDraggable } from '@/hocs/withDraggable';
import { useHorizontalScrollToNode, useLinkedState, usePermission, useScrollHelpers, useScrollStickySides } from '@/hooks';
import { useToggle } from '@/hooks/toggle';
import { DashboardClassName } from '@/styles/constants';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import DragZone from './DragZone';
import Item from './Item';

interface DropContainerProps {
  className?: string;
  connectedRootRef?: React.RefObject<HTMLDivElement>;
}

const DropItem: React.OldFC<DropContainerProps> = ({ children, className, connectedRootRef }) => (
  <div ref={connectedRootRef} className={className}>
    {children}
  </div>
);

const DropContainer = withDraggable({
  name: 'dashboard-item',
  canDrag: _constant(false),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
  dropOnly: true,
})(DropItem);

export interface ListProps extends InjectedDraggableComponentProps {
  id: string;
  name: string;
  projects?: Realtime.AnyProject[];
  isNew?: boolean;
  createProject: (listID: string) => void;
  onRename?: (listID: string, name: string) => void;
  onRemove: (list: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => void;
  onMoveProject?: (drag: BaseDragItem<'onDrag', 'onMove'>, hover: HoverItem<'onDrag', 'onMove'>) => void;
  onDropProject?: (dropOptions: DropOptions) => void;
  clearNewBoard: VoidFunction;
  isCreated?: boolean;
  isDragging?: boolean;
  projectID?: string;
  isDraggingPreview?: boolean;
}

export const List: React.OldFC<ListProps> = ({
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
  createProject,
  connectedRootRef,
  isDraggingPreview,
}) => {
  const isEmpty = !projects || !projects.length;

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [canManageLists] = usePermission(Permission.PROJECT_LIST_MANAGE);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);

  const [localName, setLocalName] = useLinkedState(name);
  const [isCreatingSkill] = useToggle(false);

  useHorizontalScrollToNode(listRef, isCreated, [id, isCreated]);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();

  const [isHeaderShadowShown, isFooterShadowShown] = useScrollStickySides(bodyRef, [projects]);

  const [moving, setMoving] = React.useState(false);

  const saveName = React.useCallback(() => onRename?.(id, localName), [id, localName, onRename]);

  React.useEffect(() => {
    if (isNew) {
      inputRef.current?.focus();
      clearNewBoard();
    }
  }, []);

  return (
    <div
      ref={canManageLists ? connectedRootRef : undefined}
      style={{ cursor: !canManageLists ? 'default' : undefined }}
      className={cn(DashboardClassName.LIST, {
        '__is-draggable __is-dragging': isDraggingPreview,
      })}
    >
      <div
        ref={listRef}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        className={cn({
          hidden: isDragging,
          '__type-create': isCreatingSkill,
          '__is-draggable __is-dragging': isDraggingPreview,
        })}
      >
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
                value={localName}
                onBlur={saveName}
                disabled={!canManageLists}
                onChange={withTargetValue(setLocalName)}
                onKeyPress={withEnterPress(saveName)}
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
                    <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                  )}
                </Dropdown>
              </div>
            )}
          </DropContainer>

          {!isEmpty && (
            <div ref={bodyRef} className={cn(DashboardClassName.LIST_BODY, { 'h-o-0': isDragging, still: !moving })}>
              <div ref={innerRef} className={DashboardClassName.LIST_BODY_INNER}>
                <ul className={DashboardClassName.PROJECT_LIST}>
                  {projects.map((project, index) => {
                    if (!project) return null;

                    return (
                      <li key={project.id} className={DashboardClassName.PROJECT_LIST_ITEM}>
                        <Item
                          index={index}
                          id={project.id}
                          versionID={project.versionID}
                          listId={id}
                          created={project.created}
                          isFB={false}
                          avatarUrl={project.image}
                          name={project.name}
                          nlu={project.nlu}
                          platform={project.platform}
                          projectType={project.type}
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
      </div>
      {isDragging && <DragZone className={DashboardClassName.LIST_DRAGZONE} />}
    </div>
  );
};

export default withDraggable({
  name: 'dashboard-list',
  styles: { display: 'flex' },
  canDrag: (monitor) => !monitor.getItem()?.disableDragging,
  canDrop: _constant(true),
  onMoveKey: 'onMove',
  onDropKey: 'onDrop',
  allowXTransform: true,
  allowYTransform: false,
})<ListProps>(List);
