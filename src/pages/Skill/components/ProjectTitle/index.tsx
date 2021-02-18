import React from 'react';

import { Permission } from '@/config/permissions';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { ExportProjectButton, ProjectTitleContainer, TitleInput } from './components';

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
  const [formValue, updateFormValue] = React.useState(title);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isPrototypingMode = usePrototypingMode();
  const isLocked = isLockedSelector(Realtime.ResourceType.SETTINGS);

  React.useEffect(() => {
    updateFormValue(title);
  }, [title]);

  const onBlur = () => {
    updateFormValue(validateTitle(formValue));
    onChange(validateTitle(formValue));

    unlockResource();
  };

  const onFocus = () => {
    if (!isLocked && !isPrototypingMode && canEditCanvas) {
      lockResource();
    }
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <ProjectTitleContainer>
      <TitleInput
        id={Identifier.PROJECT_TITLE}
        readOnly={isLocked || isPrototypingMode || !canEditCanvas}
        value={formValue}
        onChange={updateFormValue}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={handleEnterPress}
        disabled={isLocked || !canEditCanvas}
      />
      <ExportProjectButton />
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
