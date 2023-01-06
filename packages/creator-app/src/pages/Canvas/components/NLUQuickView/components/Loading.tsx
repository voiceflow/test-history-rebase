import { FlexCenter, Spinner } from '@voiceflow/ui';
import React from 'react';

const Loading: React.OldFC = () => {
  return (
    <FlexCenter fullHeight>
      <Spinner borderLess />
    </FlexCenter>
  );
};

export default Loading;
