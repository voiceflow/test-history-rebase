import { BaseProject } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useAsyncEffect } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import client from '@/client';
import { designerClient } from '@/client/designer';
import * as Organization from '@/ducks/organization';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

export const useWorkspacesAndMembers = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const sessionActiveWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const getOrganizationMemberByID = useSelector(Organization.getMemberByIDSelector);

  const deleteMember = useDispatch(WorkspaceV2.deleteMember);
  const updateMember = useDispatch(WorkspaceV2.updateMember);

  const [loading, setLoading] = React.useState(true);
  const [workspaces, setWorkspaces] = React.useState<Realtime.Identity.Workspace[]>([]);
  const [activeWorkspaceID, setActiveWorkspaceID] = React.useState(sessionActiveWorkspaceID);
  const [workspaceMembersMap, setWorkspaceMembersMap] = React.useState<Record<string, Normal.Normalized<Realtime.WorkspaceMember>>>({});
  const [projectEditorMembersMap, setProjectEditorMembersMap] = React.useState<Record<number, string[]>>({});

  const onRemoveMember = async (member: Realtime.WorkspaceMember) => {
    if (activeWorkspaceID === null) return;

    await deleteMember(activeWorkspaceID, member.creatorID);

    setWorkspaceMembersMap((prev) => {
      const workspaceMembers = prev[activeWorkspaceID ?? ''];

      if (!workspaceMembers) return prev;

      return { ...prev, [activeWorkspaceID ?? '']: Normal.remove(workspaceMembers, String(member.creatorID)) };
    });
  };

  const onUpdateMember = async (member: Realtime.WorkspaceMember, role: UserRole) => {
    if (activeWorkspaceID === null) return;

    await updateMember(activeWorkspaceID, member.creatorID, role);

    setWorkspaceMembersMap((prev) => {
      const workspaceMembers = prev[activeWorkspaceID ?? ''];

      if (!workspaceMembers) return prev;

      return { ...prev, [activeWorkspaceID ?? '']: Normal.patchOne(workspaceMembers, String(member.creatorID), { role }) };
    });
  };

  const uniqueOrganizationMembersCount = React.useMemo(
    () => Utils.array.unique(Object.values(workspaceMembersMap).flatMap(({ allKeys }) => allKeys)).length,
    [workspaceMembersMap]
  );

  const uniqueOrganizationEditorsCount = React.useMemo(() => {
    const editorMemberIDs = Object.values(workspaceMembersMap)
      .flatMap((member) => Normal.denormalize(member))
      .filter((member) => isEditorUserRole(member.role))
      .map((member) => member.creatorID);
    return Utils.array.unique(editorMemberIDs).length;
  }, [workspaceMembersMap]);

  const activeWorkspaceMembers = React.useMemo(
    () =>
      Normal.denormalize(workspaceMembersMap[activeWorkspaceID ?? ''] ?? Normal.createEmpty()).map((member) => ({
        ...member,
        projects: projectEditorMembersMap[member.creatorID] ?? [],
        isOrganizationAdmin: member.creatorID ? isAdminUserRole(getOrganizationMemberByID({ creatorID: member.creatorID })?.role) : false,
      })),
    [activeWorkspaceID, workspaceMembersMap, projectEditorMembersMap]
  );

  useAsyncEffect(async () => {
    if (!organizationID) return;

    setLoading(true);

    try {
      // TODO: [organization refactor] fix types
      const workspaces = (await designerClient.organization.getOrganizationWorkspaces(organizationID)) as unknown as Realtime.Identity.Workspace[];
      const hasActiveWorkspace = workspaces.some(({ id }) => id === sessionActiveWorkspaceID);

      setWorkspaces(workspaces);
      setActiveWorkspaceID(hasActiveWorkspace ? sessionActiveWorkspaceID : workspaces[0]?.id ?? null);
      setWorkspaceMembersMap(
        Object.fromEntries(
          workspaces.map(({ id, members }) => [
            id,
            Normal.normalize(Realtime.Adapters.Identity.workspaceMember.mapFromDB(members ?? []), (member) => String(member.creatorID)),
          ])
        )
      );
    } catch {
      toast.error('Failed to load organization members');
    } finally {
      setLoading(false);
    }
  }, [organizationID]);

  useAsyncEffect(async () => {
    if (!activeWorkspaceID) return;

    setProjectEditorMembersMap({});

    const [projects, projectMembers] = await Promise.all([
      client.api.project.list<Pick<BaseProject.Project, '_id' | 'name'>>(activeWorkspaceID, ['_id', 'name']),
      client.identity.projectMember.listForWorkspace(activeWorkspaceID),
    ]);

    const projectNameMap = Object.fromEntries(projects.map((project) => [project._id, project.name]));
    const memberProjectsMap = projectMembers.reduce<Record<number, string[]>>((acc, member) => {
      acc[member.user.id] ??= [];

      const projectName = projectNameMap[member.membership.projectID];

      if (projectName && isEditorUserRole(member.membership.role)) {
        acc[member.user.id]!.push(projectName);
      }

      return acc;
    }, {});

    setProjectEditorMembersMap(memberProjectsMap);
  }, [activeWorkspaceID]);

  return {
    loading,
    workspaces,
    onRemoveMember,
    onUpdateMember,
    activeWorkspaceID,
    workspaceMembersMap,
    setActiveWorkspaceID,
    activeWorkspaceMembers,
    uniqueOrganizationMembersCount,
    uniqueOrganizationEditorsCount,
  };
};

export const useMembersFilters = (members: Realtime.WorkspaceMember[]) => {
  const [role, setRole] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filteredMembers = React.useMemo(() => {
    if (!members.length || (!role && !search)) return members;

    const lowSearch = search.toLowerCase();

    return members.filter((member) => {
      if (role && role !== 'all' && member.role !== role) return false;

      if (search) {
        return member.name?.toLowerCase().includes(lowSearch) || member.email?.toLocaleLowerCase().includes(lowSearch);
      }

      return true;
    });
  }, [search, role, members]);

  const onClearFilters = () => {
    setSearch('');
    setRole('all');
  };

  return { role, setRole, search, setSearch, filteredMembers, onClearFilters };
};
