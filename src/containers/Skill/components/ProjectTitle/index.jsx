import React from 'react';

import { useEnableDisable } from '@/hooks/toggle';
import { moveCursorToEnd } from '@/utils/dom';

import ProjectTitleContainer from './ProjectTitleContainer';

const EMPTY_TITLE_DEFAULT = 'Untitled Project';

const validateTitle = (value) => {
  if (!value.trim()) {
    return EMPTY_TITLE_DEFAULT;
  }
  return value;
};

const ProjectTitle = ({ title, onChange }) => {
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const [formValue, updateFormValue] = React.useState(title);

  React.useEffect(() => {
    updateFormValue(title);
  }, [title]);

  const onBlur = () => {
    updateFormValue(validateTitle(formValue));
    onChange(validateTitle(formValue));

    disableEditing();
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <ProjectTitleContainer>
      <input
        onDoubleClick={(e) => {
          if (!isEditing) {
            enableEditing();
            moveCursorToEnd(e.target);
          }
        }}
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        className="edit-input"
        readOnly={!isEditing}
        value={formValue}
        onChange={({ target }) => updateFormValue(target.value)}
        onBlur={onBlur}
        onKeyPress={handleEnterPress}
      />
    </ProjectTitleContainer>
  );
};

export default ProjectTitle;
