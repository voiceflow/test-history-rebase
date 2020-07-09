import React from 'react';

import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks/toggle';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import ProjectTitleContainer from './ProjectTitleContainer';

const EMPTY_TITLE_DEFAULT = 'Untitled Project';

const validateTitle = (value: string) => {
  if (!value.trim()) {
    return EMPTY_TITLE_DEFAULT;
  }
  return value;
};

export type ProjectTitleProps = {
  title: string;
  canEdit: boolean;
  onChange: (value: string) => void;
};

const ProjectTitle: React.FC<ProjectTitleProps & ConnectedProjectTitleProps> = ({
  title,
  canEdit,
  onChange,
  lockResource,
  unlockResource,
  isLockedSelector,
}) => {
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

  const onDoubleClick = (event: React.MouseEvent) => {
    if (!isEditing && !isLocked && canEdit) {
      enableEditing();
      (event.target as HTMLInputElement).select();
      lockResource();
    }
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <ProjectTitleContainer id="project-title">
      <input
        id={Identifier.PROJECT_TITLE}
        onDoubleClick={onDoubleClick}
        className="edit-input"
        readOnly={!isEditing}
        value={formValue}
        onChange={({ target }) => updateFormValue(target.value)}
        onBlur={onBlur}
        onKeyPress={handleEnterPress}
        disabled={isLocked || !canEdit}
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

type ConnectedProjectTitleProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitle) as React.FC<ProjectTitleProps>;
