import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import { TopLevelButton, TopLevelInnerContainer, TopLevelOuterContainer } from './components';
import { STEPS } from './constants';

const StepMenu: React.FC = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  return (
    <>
      {canEditCanvas && (
        <TopLevelOuterContainer>
          <TopLevelInnerContainer>
            {STEPS.map((step) => (
              <TopLevelButton key={step} />
            ))}
          </TopLevelInnerContainer>
        </TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
