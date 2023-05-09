import './index.css';

import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import EmptyScreen from '@/components/EmptyScreen';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { DragItem } from '@/hocs/withDraggable';
import { useDispatch, useDropLagFix, usePermission, usePlanLimitedConfig, useScrollHelpers, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DashboardClassName, Identifier } from '@/styles/constants';

import DragLayer from './DragLayer';
import { Item as ListItem, ItemProps as ListItemProps, OwnItemProps as ListItemOwnProps } from './Item';
import DraggableList, { List, ListProps, OwnListProps } from './List';

const getBoardFilteredProjects = (projectsIDs: string[], getProjectByID: (projectID: string) => Realtime.AnyProject | null, filter: string) => {
  const filtered: Realtime.AnyProject[] = [];

  projectsIDs.forEach((id) => {
    const project = getProjectByID(id);

    if (project?.name.toLowerCase().includes(filter)) {
      filtered.push(project);
    }
  });

  return filtered;
};

export interface ProjectListListProps {
  filter: string;
  fullHeightContainer?: boolean;
}

export const ProjectListList: React.FC<ProjectListListProps> = ({ filter, fullHeightContainer }) => {
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const projectLists = useSelector(ProjectListV2.allProjectListsSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);

  const createList = useDispatch(ProjectList.createProjectList);
  const deleteList = useDispatch(ProjectList.deleteProjectList);
  const renameList = useDispatch(ProjectList.renameProjectList);
  const moveProjectList = useDispatch(ProjectList.moveProjectList);
  const transplantProjectBetweenLists = useDispatch(ProjectList.transplantProjectBetweenLists);

  const [canManageLists] = usePermission(Permission.PROJECT_LIST_MANAGE);
  const projectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, { value: projects.length, limit: projectsLimit });

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const confirmModal = ModalsV2.useModal(ModalsV2.Confirm);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);

  const dropLagFixRef = useDropLagFix(['dashboard-list', 'dashboard-item']);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();

  const [newListID, setNewListID] = React.useState<string | null>(null);

  const dragCache = React.useRef({
    toListID: '',
    fromListID: '',
    toListIndex: -1,
    fromProjectID: '',
    toProjectIndex: -1,
  });

  const onCreateList = React.useCallback(async () => {
    const list = await createList();

    setNewListID(list.id);
  }, []);

  const onClearNewList = React.useCallback(() => setNewListID(null), []);

  const onCreateProject = React.useCallback(
    (id?: string) => {
      if (projectsLimitConfig) {
        upgradeModal.openVoid(projectsLimitConfig.upgradeModal(projectsLimitConfig.payload));
      } else {
        projectCreateModal.openVoid({ listID: id });
      }
    },
    [projectsLimitConfig]
  );

  const onDeleteBoard = React.useCallback(({ name, id, projects }: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => {
    confirmModal.openVoid({
      header: 'Delete Assistant List',

      body: (
        <>
          This action can not be undone, <b>"{name}"</b> and all {!!projects && projects.length} assistants can not be recovered.
        </>
      ),

      confirm: async () => {
        try {
          await deleteList(id);
        } catch (error) {
          errorModal.openVoid({ error });

          throw error;
        }
      },

      confirmButtonText: 'Delete',
    });
  }, []);

  const onDragStart = React.useCallback((item: DragItem<OwnListProps>) => {
    dragCache.current.fromListID = item.id;
  }, []);

  const onMove = React.useCallback(
    (drag: DragItem<OwnListProps>, hover: DragItem<OwnListProps>) => {
      dragCache.current.toListIndex = hover.index;

      moveProjectList({ toIndex: hover.index, fromID: drag.id, skipPersist: true });
    },
    [moveProjectList]
  );

  const onDrop = React.useCallback(() => {
    if (dragCache.current.toListIndex === -1 || !dragCache.current.fromListID) return;

    moveProjectList({
      fromID: dragCache.current.fromListID,
      toIndex: dragCache.current.toListIndex,
    });

    dragCache.current = {
      toListID: '',
      fromListID: '',
      toListIndex: -1,
      fromProjectID: '',
      toProjectIndex: -1,
    };
  }, [transplantProjectBetweenLists]);

  const onDragStartProject = React.useCallback((item: DragItem<ListItemOwnProps>) => {
    if (!item.listID) return;

    dragCache.current.fromListID = item.listID;
    dragCache.current.fromProjectID = item.id;
  }, []);

  const onMoveProject = React.useCallback(
    (drag: DragItem<ListItemOwnProps>, hover: DragItem<ListItemOwnProps>) => {
      if (!drag.listID || !hover.listID) return;

      dragCache.current.toListID = hover.listID;
      dragCache.current.toProjectIndex = hover.index;

      transplantProjectBetweenLists({
        toListID: hover.listID,
        fromListID: drag.listID,
        skipPersist: true,
        fromProjectID: drag.id,
        toProjectIndex: hover.index,
      });
    },
    [transplantProjectBetweenLists]
  );

  const onDropProject = React.useCallback(() => {
    if (!dragCache.current.toListID || !dragCache.current.fromListID || dragCache.current.toProjectIndex === -1 || !dragCache.current.fromProjectID) {
      return;
    }

    transplantProjectBetweenLists({
      toListID: dragCache.current.toListID,
      fromListID: dragCache.current.fromListID,
      fromProjectID: dragCache.current.fromProjectID,
      toProjectIndex: dragCache.current.toProjectIndex,
    });

    dragCache.current = {
      toListID: '',
      fromListID: '',
      toListIndex: -1,
      fromProjectID: '',
      toProjectIndex: -1,
    };
  }, [transplantProjectBetweenLists]);

  return (
    <div id="dashboard" ref={dropLagFixRef} className={cn({ 'full-height': fullHeightContainer })}>
      {projects.length === 0 ? (
        <EmptyScreen
          id={Identifier.NEW_PROJECT_BUTTON}
          body="This workspace has no assistants, create one."
          title="No Assistants Found"
          onClick={() => onCreateProject()}
          buttonText="New Assistant"
        />
      ) : (
        <div className={DashboardClassName.LISTS_CONTAINER}>
          <div className={DashboardClassName.LISTS_CONTAINER_INNER}>
            <ScrollContextProvider value={scrollHelpers}>
              <div ref={bodyRef} className={DashboardClassName.LISTS}>
                <div ref={innerRef} className={DashboardClassName.LISTS_INNER}>
                  {projectLists.map((list, index) => {
                    const projects = getBoardFilteredProjects(list.projects, (id) => getProjectByID({ id }), filter);

                    if (filter && !projects.length) return null;

                    return (
                      <DraggableList
                        id={list.id}
                        key={list.id}
                        name={list.name}
                        isNew={list.id === newListID}
                        index={index}
                        onMove={onMove}
                        onDrop={onDrop}
                        onRename={renameList}
                        onRemove={onDeleteBoard}
                        projects={projects}
                        onDragStart={onDragStart}
                        onMoveProject={onMoveProject}
                        clearNewBoard={onClearNewList}
                        createProject={onCreateProject}
                        onDropProject={onDropProject}
                        disableDragging={!!filter}
                        onDragStartProject={onDragStartProject}
                      />
                    );
                  })}

                  <DragLayer>
                    {(item: { dragType: string } & (ListProps | ListItemProps)) => {
                      if (item.dragType === 'dashboard-list') {
                        return <List {...(item as ListProps)} />;
                      }

                      if (item.dragType === 'dashboard-item') {
                        return <ListItem {...(item as ListItemProps)} />;
                      }

                      return null;
                    }}
                  </DragLayer>

                  {canManageLists && (
                    <Box.Flex flex="0 0 auto" margin="15px 27px" minWidth="0" className={DashboardClassName.ADD_LIST_BUTTON} alignSelf="flex-start">
                      <TippyTooltip offset={[0, 8]} content="Add new list" position="bottom">
                        <IconButton large icon="plus" onClick={onCreateList} size={13} />
                      </TippyTooltip>
                    </Box.Flex>
                  )}
                </div>
              </div>
            </ScrollContextProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default withBatchLoadingGate(WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate)(ProjectListList);
