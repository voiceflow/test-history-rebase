import React from 'react';
import { connect } from 'react-redux';

import { ProjectTitleContainer, Text } from '../styled';

export function ProjectTitle({ skill }) {
  return (
    <ProjectTitleContainer>
      <Text>{(skill && skill.name) || 'Loading Skill'}</Text>
    </ProjectTitleContainer>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

export default connect(mapStateToProps)(ProjectTitle);
