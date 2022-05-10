import { Box, getNestedMenuFormattedLabel } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { NLUManagerContext } from '@/pages/NLUManager/context';

const NameBoxWrapper = styled(Box)`
  & > b {
    text-decoration: underline;
  }
`;

const NameBox: React.FC<{ name: string; flex: number }> = ({ name, flex }) => {
  const { search } = React.useContext(NLUManagerContext);

  return <NameBoxWrapper flex={flex}>{getNestedMenuFormattedLabel(name, search)}</NameBoxWrapper>;
};

export default NameBox;
