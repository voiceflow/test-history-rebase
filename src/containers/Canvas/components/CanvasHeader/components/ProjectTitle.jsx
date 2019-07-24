import React from 'react';
import { connect } from 'react-redux';

import SvgIcon from '@/components/SvgIcon';
import { useEnableDisable } from '@/hooks/toggle';
import { history } from '@/store/store';
import LeftIcon from '@/svgs/arrow-left.svg';

import { BackButton, ProjectTitleContainer } from '../styled';

export function ProjectTitle({ skill, onChange }) {
  const [isEditing, onStartEditing, onStopEditing] = useEnableDisable();

  return (
    <ProjectTitleContainer onDoubleClick={onStartEditing}>
      <BackButton className="mx-3">
        <SvgIcon icon={LeftIcon} className="icon-back" onClick={() => history.push('/')} />
      </BackButton>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isEditing ? (
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="edit-input"
          value={skill.name}
          onChange={(e) => {
            onChange('name', e.target.value);
            onChange('inv_name', e.target.value);
          }}
          onBlur={onStopEditing}
        />
      ) : (
        (skill && skill.name) || 'Loading Skill'
      )}
    </ProjectTitleContainer>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

export default connect(mapStateToProps)(ProjectTitle);
