import React from 'react';

import { useIntent } from '@/hooks';

import HeaderOptions, { HeaderOptionsProps } from './HeaderOptions';

const IntentHeaderOptions: React.OldFC<HeaderOptionsProps> = (props) => {
  const { intentIsBuiltIn } = useIntent(props.selectedID);

  return <HeaderOptions {...props} isBuiltIn={intentIsBuiltIn} />;
};

export default IntentHeaderOptions;
