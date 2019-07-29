import React from 'react';
import { connect } from 'react-redux';

import { updateSkillDB } from '@/ducks/version';
import { useEnableDisable } from '@/hooks/toggle';

import { ProjectTitleContainer, ProjectTitleInput, Text } from '../styled';

export function ProjectTitle({ skill, onChange, saveSkill }) {
  const [isEditing, onStartEditing, onStopEditing] = useEnableDisable();

  return (
    <ProjectTitleContainer onDoubleClick={onStartEditing}>
      {isEditing ? (
        <ProjectTitleInput
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          spellCheck={false}
          value={skill.name}
          onChange={(e) => {
            onChange('name', e.target.value);
            onChange('inv_name', e.target.value);
          }}
          onBlur={() => {
            onStopEditing();
            saveSkill();
          }}
        />
      ) : (
        <Text>{(skill && skill.name) || 'Loading Skill'}</Text>
      )}
    </ProjectTitleContainer>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  saveSkill: updateSkillDB,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectTitle);
