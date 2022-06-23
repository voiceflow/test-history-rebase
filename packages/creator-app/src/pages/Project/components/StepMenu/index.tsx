import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import { TopLevelButton, TopLevelInnerContainer, TopLevelOuterContainer } from './components';
import { STEPS, TopStepItem } from './constants';

const StepMenu: React.FC = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [activeButton, setActiveButton] = React.useState<string | null>(null);

  const handleOnClick = (step: TopStepItem) => {
    setActiveButton(step.name);
  };

  return (
    <>
      {canEditCanvas && (
        <TopLevelOuterContainer>
          <TopLevelInnerContainer>
            {STEPS.map((step) => (
              <TopLevelButton key={step.name} step={step} isFocused={activeButton === step.name} onClick={handleOnClick} />
            ))}
          </TopLevelInnerContainer>
        </TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
