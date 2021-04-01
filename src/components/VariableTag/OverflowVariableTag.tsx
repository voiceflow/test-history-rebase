import React from 'react';

import { Flex } from '@/components/Box';

import { VariableTag } from './VariableTag';

type OverflowingVariableTag = {
  variableName: string;
  maxLineLength?: number;
};

export const OverflowVariableTag: React.FC<OverflowingVariableTag> = ({ variableName, maxLineLength = 16 }) => {
  const nameFragments = React.useMemo(() => {
    if (variableName.length <= maxLineLength - 2) return [variableName]; // `{${variableName}}` is <= maxLineLength

    const fragments: string[] = [];
    let curString = `{${variableName}}`;
    while (curString.length !== 0) {
      fragments.push(curString.substr(0, maxLineLength));
      curString = curString.substr(maxLineLength);
    }

    return fragments;
  }, [variableName, maxLineLength]);

  return (
    <Flex style={{ alignItems: 'flex-start' }} column>
      {nameFragments.map((fragment: string, index: number) => (
        <Flex key={`${fragment}-${index}`}>
          <VariableTag>{fragment}</VariableTag>
        </Flex>
      ))}
    </Flex>
  );
};

export default OverflowVariableTag;
