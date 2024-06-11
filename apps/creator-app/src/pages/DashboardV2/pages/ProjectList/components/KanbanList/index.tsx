import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import EmptyScreen from '@/components/EmptyScreen';
import Page from '@/components/Page';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import { ScrollContextProvider } from '@/contexts/ScrollContext';
import * as Organization from '@/ducks/organization';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { DragItem } from '@/hocs/withDraggable';
import {
  useDispatch,
  useDropLagFix,
  usePermission,
  usePlanLimitedConfig,
  useScrollHelpers,
  useSelector,
} from '@/hooks';
import { useConditionalLimit } from '@/hooks/planLimitV3';
import * as ModalsV2 from '@/ModalsV2';
import { DashboardClassName, Identifier } from '@/styles/constants';

import { Sidebar } from '../../../../components';
import Header from '../Header';
import { Container } from './Container';
import DragLayer from './DragLayer';
import { Item as ListItem, OwnItemProps as ListItemOwnProps, ItemProps as ListItemProps } from './Item';
import DraggableList, { List, ListProps, OwnListProps } from './List';

export const ProjectListList: React.FC = () => {
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const projectLists = useSelector(ProjectListV2.allProjectListsSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const createList = useDispatch(ProjectListV2.createProjectList);
  const deleteList = useDispatch(ProjectListV2.deleteProjectList);
  const renameList = useDispatch(ProjectListV2.renameProjectList);
  const moveProjectList = useDispatch(ProjectListV2.moveProjectList);
  const transplantProjectBetweenLists = useDispatch(ProjectListV2.transplantProjectBetweenLists);

  const [canManageLists] = usePermission(Permission.WORKSPACE_MANAGE_PROJECT_LIST);

  // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
  const legacyProjectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, {
    value: projects.length,
    limit: projectsLimit,
  });
  const newProjectsLimitConfig = useConditionalLimit(LimitType.PROJECTS, { value: projects.length });

  const projectsLimitConfig = subscription ? newProjectsLimitConfig : legacyProjectsLimitConfig;

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const confirmModal = ModalsV2.useModal(ModalsV2.Confirm);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);

  const dropLagFixRef = useDropLagFix(['dashboard-list', 'dashboard-item']);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();

  const [search, setSearch] = React.useState('');
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

  const onDeleteBoard = React.useCallback(
    ({ name, id, projects }: { id: string; name?: string; projects?: Realtime.AnyProject[] }) => {
      confirmModal.openVoid({
        header: 'Delete Agent List',

        body: (
          <>
            This action can not be undone, <b>"{name}"</b> and all {!!projects && projects.length} agents can not be
            recovered.
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
    },
    []
  );

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
    if (
      !dragCache.current.toListID ||
      !dragCache.current.fromListID ||
      dragCache.current.toProjectIndex === -1 ||
      !dragCache.current.fromProjectID
    ) {
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

  const projectListsWithProjects = React.useMemo(
    () =>
      projectLists.map((list) => ({
        ...list,
        projects: list.projects.map((projectID) => getProjectByID({ id: projectID })).filter(Utils.array.isNotNullish),
      })),
    [projectLists, getProjectByID]
  );

  const projectListsToRender = React.useMemo(() => {
    const transformedSearch = search.toLowerCase().trim();

    if (!transformedSearch) return projectListsWithProjects;

    return projectListsWithProjects
      .map((list) => {
        const projects = list.projects.filter((project) => project.name.toLowerCase().includes(transformedSearch));

        return projects.length ? { ...list, projects } : null;
      })
      .filter(Utils.array.isNotNullish);
  }, [search, projectListsWithProjects]);

  return (
    <Page
      renderHeader={() => <Header search={search} onSearch={setSearch} isKanban />}
      renderSidebar={() => <Sidebar />}
    >
      <Container id="dashboard" ref={dropLagFixRef}>
        {projects.length === 0 ? (
          <EmptyScreen
            id={Identifier.NEW_PROJECT_BUTTON}
            body="This workspace has no agents, create one."
            title="No Agents Found"
            onClick={() => onCreateProject()}
            buttonText="New Agent"
          />
        ) : (
          <div className={DashboardClassName.LISTS_CONTAINER}>
            <div className={DashboardClassName.LISTS_CONTAINER_INNER}>
              <ScrollContextProvider value={scrollHelpers}>
                <div ref={bodyRef} className={DashboardClassName.LISTS}>
                  <div ref={innerRef} className={DashboardClassName.LISTS_INNER}>
                    {projectListsToRender.map((list, index) => (
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
                        projects={list.projects}
                        onDragStart={onDragStart}
                        onMoveProject={onMoveProject}
                        clearNewBoard={onClearNewList}
                        createProject={onCreateProject}
                        onDropProject={onDropProject}
                        disableDragging={!!search}
                        onDragStartProject={onDragStartProject}
                      />
                    ))}

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
                      <Box.Flex
                        flex="0 0 auto"
                        margin="15px 27px"
                        minWidth="0"
                        className={DashboardClassName.ADD_LIST_BUTTON}
                        alignSelf="flex-start"
                      >
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
      </Container>
    </Page>
  );
};

export default ProjectListList;
