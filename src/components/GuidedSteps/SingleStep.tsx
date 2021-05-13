import React from 'react';

import SingleStepWrapper from './SingleStepWrapper';

interface SingleStepProps {
  active: boolean;
}

const SingleStep: React.FC<SingleStepProps> = ({ active, children }) => {
  const [height, setHeight] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setHeight(containerRef.current?.scrollHeight ?? null), [active]);

  return (
    <SingleStepWrapper height={height} isActive={active} ref={containerRef}>
      {children}
    </SingleStepWrapper>
  );
};

export default SingleStep;
