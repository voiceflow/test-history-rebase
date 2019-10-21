import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { StepManagerContext } from '@/containers/Designer/contexts';

import StepHandleContainer from './StepHandleContainer';

const StepHandle = () => {
  const handleRef = React.useRef();
  const [handleWidth, setHandleWidth] = React.useState(0);
  const stepManager = React.useContext(StepManagerContext);

  React.useEffect(() => {
    if (!stepManager.isDragging) {
      setHandleWidth(handleRef.current.firstChild.scrollWidth);
    }
  }, [handleRef.current]);

  if (stepManager.isDragging) {
    return null;
  }

  return (
    <StepHandleContainer width={handleWidth}>
      <SvgIcon icon="grid" ref={handleRef} />
    </StepHandleContainer>
  );
};

export default StepHandle;
