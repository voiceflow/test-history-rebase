import React from 'react';

import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { useFeature, usePermission } from '@/hooks';
import { useEnableDisable } from '@/hooks/toggle';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import ExportProjectButton from './ExportProjectButton';
import ProjectTitleContainer from './ProjectTitleContainer';
import { TitleInput } from './components';

const EMPTY_TITLE_DEFAULT = 'Untitled Project';

const validateTitle = (value: string) => {
  if (!value.trim()) {
    return EMPTY_TITLE_DEFAULT;
  }
  return value;
};

export type ProjectTitleProps = {
  title: string;
  onChange: (value: string) => void;
};

const ProjectTitle: React.FC<ProjectTitleProps & ConnectedProjectTitleProps> = ({
  title,
  onChange,
  lockResource,
  unlockResource,
  isLockedSelector,
}) => {
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const [formValue, updateFormValue] = React.useState(title);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isPrototypingMode = usePrototypingMode();
  const isLocked = isLockedSelector(Realtime.ResourceType.SETTINGS);
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

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
    if (!isEditing && !isLocked && !isPrototypingMode && canEditCanvas) {
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
      <TitleInput
        id={Identifier.PROJECT_TITLE}
        onDoubleClick={onDoubleClick}
        className="edit-input"
        readOnly={!isEditing}
        value={formValue}
        onChange={({ target }) => updateFormValue(target.value)}
        onBlur={onBlur}
        onKeyPress={handleEnterPress}
        disabled={isLocked || !canEditCanvas}
      />
      {headerRedesign.isEnabled && <ExportProjectButton />}
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
