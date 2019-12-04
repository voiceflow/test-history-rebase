import React from 'react';

import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks/toggle';

import ProjectTitleContainer from './ProjectTitleContainer';

const EMPTY_TITLE_DEFAULT = 'Untitled Project';

const validateTitle = (value) => {
  if (!value.trim()) {
    return EMPTY_TITLE_DEFAULT;
  }
  return value;
};

const ProjectTitle = ({ title, onChange, lockResource, unlockResource, isLockedSelector }) => {
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const [formValue, updateFormValue] = React.useState(title);
  const isLocked = isLockedSelector(Realtime.ResourceType.SETTINGS);

  React.useEffect(() => {
    updateFormValue(title);
  }, [title]);

  const onBlur = () => {
    updateFormValue(validateTitle(formValue));
    onChange(validateTitle(formValue));

    disableEditing();
    unlockResource();
  };

  const onDoubleClick = (e) => {
    if (!isEditing && !isLocked) {
      enableEditing();
      e.target.select();
      lockResource();
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <ProjectTitleContainer>
      <input
        onDoubleClick={onDoubleClick}
        className="edit-input"
        readOnly={!isEditing}
        value={formValue}
        onChange={({ target }) => updateFormValue(target.value)}
        onBlur={onBlur}
        onKeyPress={handleEnterPress}
        disabled={!!isLocked}
      />
    </ProjectTitleContainer>
  );
};

const mapStateToProps = {
  isLockedSelector: Realtime.isResourceLockedSelector,
};

const mapDispatchToProps = {
  lockResource: () => Realtime.sendRealtimeProjectUpdate(Realtime.lockResource(Realtime.ResourceType.SETTINGS)),
  unlockResource: () => Realtime.sendRealtimeProjectUpdate(Realtime.unlockResource(Realtime.ResourceType.SETTINGS)),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectTitle);
