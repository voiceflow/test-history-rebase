import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { activeTeamIDSelector, activeTeamSelector, fetchTeams, getMembers } from '@/ducks/team';
import { connect } from '@/hocs';

const TeamLoadingGate = ({ activeTeam, loadTeam, children }) => (
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TeamLoadingGate);
