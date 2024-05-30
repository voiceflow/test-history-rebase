import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import cn from 'classnames';
import * as Normal from 'normal-store';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import * as Account from '@/ducks/account';
import { DragItem, DropOptions, InjectedDraggableProps, withDraggable } from '@/hocs/withDraggable';
import { useHorizontalScrollToNode, useLinkedState, usePermission, useScrollHelpers, useScrollStickySides, useSelector } from '@/hooks';
import { useToggle } from '@/hooks/toggle';
import { ProjectIdentityProvider } from '@/pages/Project/contexts/ProjectIdentityContext';
import { DashboardClassName } from '@/styles/constants';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import DragZone from './DragZone';
import Item, { ItemProps, OwnItemProps } from './Item';
import * as S from './styled';

interface DropContainerProps extends ItemProps {
  children?: React.ReactNode;
}

const DropItem: React.FC<DropContainerProps> = ({ children, className, connectedRootRef }) => (
  <div ref={connectedRootRef} className={className}>
    {children}
  </div>
);

const DropContainer = withDraggable<React.PropsWithChildren<OwnItemProps>>({
  name: 'dashboard-item',
  canDrag: false,
  dropOnly: true,
})(DropItem);

export interface OwnListProps {
  id: string;
  name: string;
  isNew?: boolean;
  projects?: Realtime.AnyProject[];
  onRename?: (listID: string, name: string) => void;
  onRemove: (list: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => void;
  projectID?: string;
  isCreated?: boolean;
  isDragging?: boolean;
  createProject: (listID: string) => void;
  clearNewBoard: VoidFunction;
  onMoveProject: (item: DragItem<OwnItemProps>, hoverItem: DragItem<OwnItemProps>) => void;
  onDropProject?: (item: DragItem<OwnItemProps>, options: DropOptions) => void;
  isDraggingPreview?: boolean;
  onDragStartProject?: (item: DragItem<OwnItemProps>) => void;
}

export interface ListProps extends OwnListProps, InjectedDraggableProps, React.PropsWithChildren {}

export const List: React.FC<ListProps> = ({
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
  disableDragging,
  connectedRootRef,
  isDraggingPreview,
  onDragStartProject,
}) => {
  const isEmpty = !projects || !projects.length;

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const userID = useSelector(Account.userIDSelector)!;
  const [canManageLists] = usePermission(Permission.PROJECT_LIST_MANAGE);
  const [canManageProjects] = usePermission(Permission.PROJECTS_MANAGE);

  const [isCreatingSkill] = useToggle(false);
  const [moving, setMoving] = React.useState(false);
  const [localName, setLocalName] = useLinkedState(name);

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const [isHeaderShadowShown, isFooterShadowShown] = useScrollStickySides(bodyRef, [projects]);

  const saveName = React.useCallback(() => onRename?.(id, localName), [id, localName, onRename]);

  const onDragStart = React.useCallback(
    (item: DragItem<OwnItemProps>) => {
      setMoving(true);
      onDragStartProject?.(item);
    },
    [onDragStartProject]
  );

  const onDrop = React.useCallback(
    (item: DragItem<OwnItemProps>, option: DropOptions) => {
      setMoving(false);
      onDropProject?.(item, option);
    },
    [onDropProject]
  );

  React.useEffect(() => {
    if (isNew) {
      inputRef.current?.focus();
      clearNewBoard();
    }
  }, []);

  useHorizontalScrollToNode(listRef, isCreated, [id, isCreated]);

  return (
    <S.ListContainer
      ref={canManageLists ? connectedRootRef : undefined}
      style={{ cursor: !canManageLists || disableDragging ? 'default' : undefined }}
      className={cn(DashboardClassName.LIST, { '__is-draggable __is-dragging': isDraggingPreview })}
    >
      <div
        ref={listRef}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        className={cn({ hidden: isDragging, '__type-create': isCreatingSkill, '__is-draggable __is-dragging': isDraggingPreview })}
      >
        <ScrollContextProvider value={scrollHelpers}>
          {isDragging && <div style={{ top: 0, left: 0, right: 0, bottom: 0 }} className={cn('h-pos-a', DashboardClassName.LIST_DROPZONE)} />}

          <DropContainer
            id="0"
            nlu={Platform.Constants.NLUType.VOICEFLOW}
            name="unknown"
            isFB={false}
            index={0}
            listID={id}
            isLive={false}
            onMove={onMoveProject}
            created=""
            locales={[]}
            className={cn(DashboardClassName.LIST_HEADER, { 'h-o-0': isDragging, __scrolling: isHeaderShadowShown })}
            platform={Platform.Constants.PlatformType.VOICEFLOW}
            versionID=""
            projectType={Platform.Constants.ProjectType.CHAT}
          >
            <div className={DashboardClassName.LIST_HEADER_MAIN}>
              <S.Input
                ref={inputRef}
                value={localName}
                onBlur={saveName}
                disabled={!canManageLists}
                onChange={withTargetValue(setLocalName)}
                className={cn('borderless-input', DashboardClassName.LIST_HEADER_TITLE)}
                maxLength={32}
                onKeyPress={withEnterPress(saveName)}
                placeholder="Enter list name"
              />
            </div>

            {canManageLists && (
              <div className={DashboardClassName.LIST_HEADER_ASIDE}>
                <Dropdown options={[{ label: 'Remove List', onClick: () => onRemove({ id, name, projects }) }]} placement="bottom-end">
                  {({ ref, onToggle, isOpen }) => (
                    <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={onToggle} ref={ref} large />
                  )}
                </Dropdown>
              </div>
            )}
          </DropContainer>

          {!isEmpty && (
            <div ref={bodyRef} className={cn(DashboardClassName.LIST_BODY, { 'h-o-0': isDragging, still: !moving })}>
              <div ref={innerRef} className={DashboardClassName.LIST_BODY_INNER}>
                <S.ProjectList className={DashboardClassName.PROJECT_LIST}>
                  {projects.map((project, index) => {
                    if (!project) return null;

                    return (
                      <li key={project.id} className={DashboardClassName.PROJECT_LIST_ITEM}>
                        <ProjectIdentityProvider projectID={project.id} projectRole={Normal.getOne(project.members, String(userID))?.role ?? null}>
                          <Item
                            id={project.id}
                            nlu={project.nlu}
                            isFB={false}
                            name={project.name}
                            index={index}
                            onDrop={onDrop}
                            onMove={onMoveProject}
                            isLive={project.isLive}
                            listID={id}
                            locales={project.locales}
                            created={project.created}
                            platform={project.platform}
                            versionID={project.versionID}
                            avatarUrl={project.image}
                            projectType={project.type}
                            onDragStart={onDragStart}
                            disableDragging={disableDragging}
                          />
                        </ProjectIdentityProvider>
                      </li>
                    );
                  })}
                </S.ProjectList>
              </div>
            </div>
          )}
          {canManageProjects && (
            <div className={cn(DashboardClassName.LIST_FOOTER, { 'h-o-0': isDragging, __scrolling: isFooterShadowShown })}>
              <div className={DashboardClassName.LIST_FOOTER_CENTER}>
                <Button variant={ButtonVariant.TERTIARY} onClick={() => createProject(id)}>
                  Create Agent
                </Button>
              </div>
            </div>
          )}
        </ScrollContextProvider>
      </div>

      {isDragging && <DragZone className={DashboardClassName.LIST_DRAGZONE} />}
    </S.ListContainer>
  );
};

export default withDraggable<OwnListProps>({
  name: 'dashboard-list',
  styles: { display: 'flex' },
  canDrag: (_monitor, props) => !props.disableDragging,
  allowXTransform: true,
  allowYTransform: false,
})(List);
