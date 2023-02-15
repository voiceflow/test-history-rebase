import { FlexCenter, Spinner } from '@voiceflow/ui';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <FlexCenter fullHeight>
      <Spinner borderLess />
    </FlexCenter>
  );
};

export default Loading;
