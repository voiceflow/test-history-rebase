import { ExpressionData } from '@voiceflow/general-types';
import React from 'react';

import Box, { Flex } from '@/components/Box';
import ConditionsBuilder from '@/components/ConditionsBuilder';
import { useManager } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';

import { NODE_CONFIG } from './constants';

// TODO: need to implement with Dragable List
// ConditionsBuilder will be the component in DragableItem

export type IfEditorProps = {
  data: {
    expressions: ExpressionData[];
  };
  onChange: (value: { expressions: ExpressionData[] }) => void;
};

const IfEditorV2: React.FC<IfEditorProps> = ({ data, onChange }) => {
  const updateExpressions = React.useCallback((expressions) => onChange({ expressions }), [onChange]);

  const { items, onAdd, mapManaged } = useManager(data.expressions, updateExpressions, {
    factory: (() => NODE_CONFIG.factory().data.expressions[0]) as any,
  } as any);

  return (
    <Content>
      <Box pl={32} pr={32}>
        {!!items.length &&
          mapManaged((map: ExpressionData, { key, onUpdate }: any) => <ConditionsBuilder expression={map} onChange={onUpdate} key={key} />)}
      </Box>
      <Flex justifyContent="center">
        <Box onClick={onAdd} padding={10} backgroundColor="pink" cursor="pointer">
          ADD CONDITION
        </Box>
      </Flex>
    </Content>
  );
};

export default IfEditorV2;
