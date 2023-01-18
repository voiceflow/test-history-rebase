import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, IconButton, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import DragLayer from '@/components/DragLayer';
import EmptyScreen from '@/components/EmptyScreen';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import * as Modal from '@/ducks/modal';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { DragItem as BaseDragItem, HoverItem as BaseHoverItem } from '@/hocs/withDraggable';
import { useDispatch, usePermission, usePlanLimitedConfig, useScrollHelpers, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DashboardClassName, Identifier } from '@/styles/constants';

import { Item as ListItem, ItemProps as ListItemProps } from './Item';
import DraggableList, { List, ListProps } from './List';

type DragItem = BaseDragItem<'onDrag', 'onMove'>;
type HoverItem = BaseHoverItem<'onDrag', 'onMove'>;

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
  workspace: Realtime.Workspace | null;
  filter: string;
  isLocked: boolean;
}

const ProjectListList: React.OldFC<ProjectListListProps> = ({ workspace, filter, isLocked }) => {
  const [newListID, setNewListID] = React.useState<string | null>(null);

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);
  const projectLists = useSelector(ProjectListV2.allProjectListsSelector);
  const createList = useDispatch(ProjectList.createProjectList);
  const setConfirm = useDispatch(Modal.setConfirm);
  const deleteList = useDispatch(ProjectList.deleteProjectList);
  const renameList = useDispatch(ProjectList.renameProjectList);
  const transplantProjectBetweenLists = useDispatch(ProjectList.transplantProjectBetweenLists);
  const moveProjectList = useDispatch(ProjectList.moveProjectList);

  const [canManageLists] = usePermission(Permission.PROJECT_LIST_MANAGE);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();

  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);
  const projectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, { value: projects.length, limit: workspace?.projects ?? 2 });
  const errorModal = ModalsV2.useModal(ModalsV2.Error);

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
    [projects, workspace]
  );

  const onDeleteBoard = React.useCallback(({ name, id, projects }: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => {
    setConfirm({
      header: 'Delete Projects List',

      body: (
        <>
          This action can not be undone, <b>"{name}"</b> and all {!!projects && projects.length} projects can not be recovered
        </>
      ),

      confirm: async () => {
        await deleteList(id).catch((err) => errorModal.openVoid({ error: err.message }));
      },
    });
  }, []);

  const onMove = React.useCallback((drag: DragItem, hover: HoverItem) => {
    moveProjectList(drag.id as string, hover.id as string);
  }, []);

  const onMoveProject = React.useCallback(
    (drag: DragItem, hover: HoverItem) => transplantProjectBetweenLists(drag.id as string, drag.listId!, hover.listId!, hover.id),
    []
  );

  return (
    <div
      id="dashboard"
      className={cn({ 'thanos-ed': isLocked })}
      onClickCapture={(e) => {
        // prevent all click events
        if (isLocked) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {projects.length === 0 ? (
        <EmptyScreen
          id={Identifier.NEW_PROJECT_BUTTON}
          title="No Projects Found"
          body="This workspace has no projects, create one."
          buttonText="New Project"
          onClick={() => onCreateProject()}
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
                        isNew={list.id === newListID}
                        index={index}
                        name={list.name}
                        onRename={renameList}
                        onRemove={onDeleteBoard}
                        projects={projects}
                        createProject={onCreateProject}
                        onMove={onMove}
                        onMoveProject={onMoveProject}
                        clearNewBoard={onClearNewList}
                        disableDragging={!!filter}
                      />
                    );
                  })}

                  <DragLayer withMemo>
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
                    <BoxFlex
                      className={DashboardClassName.ADD_LIST_BUTTON}
                      style={{ flex: '0 0 auto', alignSelf: 'flex-start', margin: '15px 27px', minWidth: '0' }}
                    >
                      <TippyTooltip offset={[0, 8]} content="Add new list" position="bottom">
                        <IconButton large icon="add2" onClick={onCreateList} size={13} />
                      </TippyTooltip>
                    </BoxFlex>
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
