import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { activeTeamIDSelector, activeTeamSelector, fetchTeams, getMembers } from '@/ducks/team';
import { connect, withLoadingGate } from '@/hocs';

const RawTeamLoadingGate = ({ activeTeam, loadTeam, children }) => (
  <LoadingGate label="Team" isLoaded={activeTeam} load={loadTeam} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeTeam: activeTeamSelector,
  activeTeamID: activeTeamIDSelector,
};

const mapDispatchToProps = {
  fetchTeams,
  getMembers,
};

const mergeProps = ({ activeTeamID }, { fetchTeams, getMembers }) => ({
  loadTeam: async () => {
    await fetchTeams();
    await getMembers(activeTeamID);
  },
});

const TeamLoadingGate = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RawTeamLoadingGate);

export default TeamLoadingGate;

export const withTeamLoaded = withLoadingGate(TeamLoadingGate);
