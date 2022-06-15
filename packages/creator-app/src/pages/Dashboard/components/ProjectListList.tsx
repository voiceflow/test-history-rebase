import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, IconButton, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import DragLayer from '@/components/DragLayer';
import EmptyScreen from '@/components/EmptyScreen';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ProjectLimitDetails } from '@/config/planLimits/projects';
import { ModalType } from '@/constants';
import { ScrollContextProvider } from '@/contexts';
import * as Modal from '@/ducks/modal';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { UpgradePrompt } from '@/ducks/tracking';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { DragItem as BaseDragItem, HoverItem as BaseHoverItem, withBatchLoadingGate } from '@/hocs';
import { useDispatch, useFeature, useModals, usePermission, useScrollHelpers, useSelector } from '@/hooks';
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

const ProjectListList: React.FC<ProjectListListProps> = ({ workspace, filter, isLocked }) => {
  const [newListID, setNewListID] = React.useState<string | null>(null);

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);
  const projectLists = useSelector(ProjectListV2.allProjectListsSelector);
  const createList = useDispatch(ProjectList.createProjectList);
  const setConfirm = useDispatch(Modal.setConfirm);
  const setError = useDispatch(Modal.setError);
  const deleteList = useDispatch(ProjectList.deleteProjectList);
  const renameList = useDispatch(ProjectList.renameProjectList);
  const transplantProjectBetweenLists = useDispatch(ProjectList.transplantProjectBetweenLists);
  const moveProjectList = useDispatch(ProjectList.moveProjectList);
  const goToNewProject = useDispatch(Router.goToNewProject);
  const goToNewIntroProject = useDispatch(Router.goToNewIntroProject);

  const [canManageLists] = usePermission(Permission.MANAGE_PROJECT_LISTS);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { open: openProjectCreateModal } = useModals(ModalType.PROJECT_CREATE_MODAL);
  const revisedEntitlements = useFeature(FeatureFlag.REVISED_CREATOR_ENTITLEMENTS);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const projectCreateFeature = useFeature(FeatureFlag.PROJECT_CREATE);

  const onCreateList = React.useCallback(async () => {
    const list = await createList();

    setNewListID(list.id);
  }, []);

  const onClearNewList = React.useCallback(() => setNewListID(null), []);

  const onCreateProject = React.useCallback(
    (id?: string) => {
      if (projects.length >= workspace!.projects && revisedEntitlements.isEnabled) {
        openUpgradeModal({ planLimitDetails: ProjectLimitDetails, promptOrigin: UpgradePrompt.PROJECT_LIMIT });
      } else if (projects.length >= workspace!.projects) {
        openProjectLimitModal({ projects: workspace!.projects });
      } else if (projectCreateFeature.isEnabled) {
        openProjectCreateModal({
          listID: id,
        });
      } else if (id === 'initial') {
        goToNewIntroProject();
      } else {
        goToNewProject(id!);
      }
    },
    [projects, workspace]
  );

  const onDeleteBoard = React.useCallback(({ name, id, projects }: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => {
    setConfirm({
      text: (
        <p className="mb-0">
          This action can not be undone, {name} and all {!!projects && projects.length} projects can not be recovered
        </p>
      ),
      warning: true,
      confirm: () => deleteList(id).catch((err) => setError(err.message)),
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
          onClick={projectCreateFeature.isEnabled ? () => onCreateProject() : goToNewIntroProject}
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
                      <TippyTooltip distance={8} title="Add new list" position="bottom">
                        <IconButton large icon="addStep" onClick={onCreateList} size={13} />
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
